# KANBAN CONTROL

## RL build
http://teamcity.renlearn.com/project.html?projectId=ClientComponents_RlKanban

## COG1 Jenkins
http://pasz.noip.us:8080/job/rl-kanban-git-master/


## COG1 bitballon static demo
http://rl-kanban.bitballoon.com

## Sub repositories - ATTENTION
Current repository contains sub repository. If you are cloning project the first time, then use next command:
```sh
git clone --recursive https://github.com/COG1-Interactive/Ren-learn-kanban
```
If you already have cloned project, or cloned it without  --recursive flag, then use command to clone submodule
```sh
git submodule update --init --recursive
```
Note, that work with sub repos require some knowledge of git submodules, but generally IDE like WebStorm can cover such knowledge.
## Development Setup
### Installation
Install node js and ruby (for Sass). Then run:
```sh 
$ npm install && bower install
```
### Running Development Server 
Start application for the first time:
```sh
$ gulp serve
```
This will create a simple Express.js server and prepare app for first time.
The first time, Sass source will be compiled into css. Each subsequent time, you can run `gulp default` or `gulp` with no args.

To run app for automated testing or continuous integration, without live reload:
```sh
$ gulp host
```
### Production Build
```sh
$ gulp build
```
Production files are move into the 'deployment' folder.  Note, both minified and unminfied files are generated.
#### "Vendor" Files
For compilation, source files are classified as Vendor or Custom.  Vendor files are assumed to be included in the container page (e.g.: Underscore.js, Angular, Foundation CSS, etc.). Vendor files get compiled into "deployment/js/vendor.js" and "deployment/css/vendor.css".  Vendor files are only necessary to include when running the control in standalone mode. 
Custom files are unique to the Kanban control.  Custom files get compiled into "deployment/js/rlkanban.js" and "deployment/css/rlkanban.css".

### Other Tasks
Remove all generated source (css files, build folder, and generated index.html):
```sh
$ gulp $clean-generated
```
Manually generate index.html:
```sh
$ gulp $inject-files
```
Manually compile all sass files into css:
```sh
$ gulp $sass
```
To run jshint on source:
```sh
$ gulp jshint
```
### Unit Testing
To run tests quickly each time code is changed:
```sh
$ gulp test-dev
```
To run tests and stop:
```sh
$ gulp test
```

## [Kanban Configuration](docs/configuration.md)

## [Kanban Events list](docs/events.md)

## [Kanban Specification in PDF](docs/RENA-UXD-KanbanControl.pdf)

## [Components](docs/components/README.md)
