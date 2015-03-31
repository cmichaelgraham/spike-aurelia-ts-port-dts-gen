# [aurelia-ts-lib](https://github.com/cmichaelgraham/aurelia-ts-port)

> a spike to attempt to port aurelia code into typescript

The process is to take the ES6 Aurelia source code, maintain a local copy here for comparison when porting across new code changes:
[aurelia repo source code](https://github.com/cmichaelgraham/aurelia-ts-port/tree/master/aurelia-latest)

Using the source from above, the next step in the process is to create equivalent, matching typescript source code by copying `.js` files and renaming them `.ts` extension, making small edits to make the typescript compiler happy, and as an added bonus, adding typescript type annotations for the public api:
[aurelia repo typescript-converted source code](https://github.com/cmichaelgraham/aurelia-ts-port/tree/master/aurelia-ts)

The (gulp-based) build process then compiles the typescript aurelia source code, creating the `.d.ts` files that consist of only the type definitions.  In addition, the `.js` files in ES6 format are created also.  These files can hopefully be used by `babel compiler` to produce ES6 modules in `register` format.
[build output](https://github.com/cmichaelgraham/aurelia-ts-port/tree/master/aurelia-ts/output-gulp)

## clone and build

1. clone this repo
2. run `git bash` shell, change to the main folder
3. change to `aurelia-ts` folder
4. run `npm install`
5. change to `node_modules/typescript` folder
8. run `npm install`
9. run `npm install -g jake` (if you haven't already)
10. run `jake local`
11. run `jake LKG`
12. change back to `aurelia-ts` folder
13. run `gulp build`

you should now see folders in the `output-gulp` folder.  each of these folders should contain `.d.ts` and `.js` files from the build.

## process steps - to add aurelia repos (or add new files):

1. run `./get-latest.sh`
    > this is a `git bash` script to help keep the aurelia-latest up to date

  1. clones aurelia repos into `aurelia-latest-repos`
  2. copies `src` folder from each repo into corresponding folder in `aurelia-latest`
3. manually copy `.js` files from `aurelia-latest` into `aurelia-ts` (rename each to `.ts`)
4. update `gulpfile.js`
5. if it is a new repo, add the <repo>.d.ts file in `output-gulp`
