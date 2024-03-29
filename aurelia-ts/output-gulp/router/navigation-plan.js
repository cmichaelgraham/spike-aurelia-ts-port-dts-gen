import { Redirect } from './navigation-commands';
export var NO_CHANGE = 'no-change';
export var INVOKE_LIFECYCLE = 'invoke-lifecycle';
export var REPLACE = 'replace';
export function buildNavigationPlan(navigationContext, forceLifecycleMinimum) {
    var prev = navigationContext.prevInstruction;
    var next = navigationContext.nextInstruction;
    var plan = {}, viewPortName;
    if (prev) {
        var newParams = hasDifferentParameterValues(prev, next);
        var pending = [];
        for (viewPortName in prev.viewPortInstructions) {
            var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
            var nextViewPortConfig = next.config.viewPorts[viewPortName];
            var viewPortPlan = plan[viewPortName] = {
                name: viewPortName,
                config: nextViewPortConfig,
                prevComponent: prevViewPortInstruction.component,
                prevModuleId: prevViewPortInstruction.moduleId,
                strategy: null,
                childNavigationContext: null
            };
            if (prevViewPortInstruction.moduleId != nextViewPortConfig.moduleId) {
                viewPortPlan.strategy = REPLACE;
            }
            else if ('determineActivationStrategy' in prevViewPortInstruction.component.executionContext) {
                //TODO: should we tell them if the parent had a lifecycle min change?
                viewPortPlan.strategy = prevViewPortInstruction.component.executionContext
                    .determineActivationStrategy(...next.lifecycleArgs);
            }
            else if (newParams || forceLifecycleMinimum) {
                viewPortPlan.strategy = INVOKE_LIFECYCLE;
            }
            else {
                viewPortPlan.strategy = NO_CHANGE;
            }
            if (viewPortPlan.strategy !== REPLACE && prevViewPortInstruction.childRouter) {
                var path = next.getWildcardPath();
                var task = prevViewPortInstruction.childRouter
                    .createNavigationInstruction(path, next).then(childInstruction => {
                    viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter
                        .createNavigationContext(childInstruction);
                    return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == INVOKE_LIFECYCLE)
                        .then(childPlan => {
                        viewPortPlan.childNavigationContext.plan = childPlan;
                    });
                });
                pending.push(task);
            }
        }
        return Promise.all(pending).then(() => plan);
    }
    else {
        for (viewPortName in next.config.viewPorts) {
            plan[viewPortName] = {
                name: viewPortName,
                strategy: REPLACE,
                config: next.config.viewPorts[viewPortName]
            };
        }
        return Promise.resolve(plan);
    }
}
export class BuildNavigationPlanStep {
    run(navigationContext, next) {
        if (navigationContext.nextInstruction.config.redirect) {
            return next.cancel(new Redirect(navigationContext.nextInstruction.config.redirect));
        }
        return buildNavigationPlan(navigationContext)
            .then(plan => {
            navigationContext.plan = plan;
            return next();
        }).catch(next.cancel);
    }
}
function hasDifferentParameterValues(prev, next) {
    var prevParams = prev.params, nextParams = next.params, nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;
    for (var key in nextParams) {
        if (key == nextWildCardName) {
            continue;
        }
        if (prevParams[key] != nextParams[key]) {
            return true;
        }
    }
    return false;
}
