* Overview of Components
** rlCommon

** rlSlider

** rlReputationWidget

** rlTooltip

** rlTree



* Components in SVN
Components can be downloaded from the SVN repo.
http://svn.renlearn.com/viewvc/RPHosted/ClientComponents/

I recommend checking out the rlComponentRunner, which lets you compile and run most of the components.
http://svn.renlearn.com/viewvc/RPHosted/ClientComponents/rlComponentRunner/

The testbed is where each component can be launched on a test page. To make this reuseable, it is located in the clientComponents directory and the gulp tasks takes a component name as a parameter and builds the testbed for it.
For instance:
```
gulp -c rlChart serve
```	    
The serve tasks copies files to the testbed and launches the testbed.

build and other tasks on the component can also be invoked from the testbed, for instance
```
gulp -c rlChart build
```


