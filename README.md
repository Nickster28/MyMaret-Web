# MyMaret-Web

A Parse+React+React-Router+Flux web dashboard for MyMaret newspaper configuration and analytics.  Created with [Create React App](https://github.com/facebookincubator/create-react-app), a tool to get quickly set up with a React project.  Create React App handles all of the compilation, linting, bundling, and more, but requires that certain files exist in the project - you can read about that, and view the complete Create React App guide, [here](https://github.com/facebookincubator/create-react-app/blob/master/template/README.md).  

To start, run `npm install` to install all necessary packages, and then run

`npm start`

This will start serving the static HTML, CSS and JS and auto-reload on changes.  The project supports the [Redux DevTools Chrome Extension](https://github.com/zalmoxisus/redux-devtools-extension) for easy debugging of app state.

To bundle all files into production-ready HTML, CSS and JS, run

`npm run build`

This will generate all production files and put them in /build, ready to be hosted.

## Additional Tidbits
There is a `commitAndPushAll.sh` script included, which if run, will build all production files and commit and push the entered file changes to both staging and master.  It will ask for a commit message on launch.  Note that you will need to add any untracked files before running this script.