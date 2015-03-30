# aurelia-ts-lib

> a spike to attempt to port aurelia code into typescript

[aurelia repo source code](https://github.com/cmichaelgraham/aurelia-ts-port/tree/master/aurelia-latest)

[aurelia repo typescript-converted source code](https://github.com/cmichaelgraham/aurelia-ts-port/tree/master/aurelia-ts)

[build output](https://github.com/cmichaelgraham/aurelia-ts-port/tree/master/aurelia-ts/output-gulp)

## clone and build

1. clone this repo
2. run `git bash` shell, change to the main folder
3. change to `aurelia-ts` folder
4. run `npm install`
5. change to `node_modules` folder
6. run `git clone https://github.com/microsoft/typescript.git`
7. change to `typescript` folder
8. run `npm install`
9. run `npm install -g jake`
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
