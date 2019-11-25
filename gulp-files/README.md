# Gulpfile

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
