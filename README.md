# KANBAN CONTROL

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
Production files are move into the 'build' folder.  Note, both minified and unminfied files are generated.
#### "Vendor" Files
For compilation, source files are classified as Vendor or Custom.  Vendor files are assumed to be included in the container page (e.g.: Underscore.js, Angular, Foundation CSS, etc.). Vendor files get compiled into "build/js/vendor.js" and "build/css/vendor.css".  Vendor files are only necessary to include when running the control in standalone mode. 
Custom files are unique to the Kanban control.  Custom files get compiled into "build/js/rlkanban.js" and "build/css/rlkanban.css".

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

## Reference
### [Kanban Configuration](docs/configuration.md)

### [Kanban Events list](docs/events.md)

### [Kanban Specification in PDF](docs/RENA-UXD-KanbanControl.pdf)

### [Components](docs/components/README.md)

