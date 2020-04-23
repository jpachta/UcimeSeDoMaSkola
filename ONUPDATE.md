# On UPDATE

Here is brief guide what steps to be done on Add-on update.


## Increase a version by one
* /updates.json
* /src/manifest.json
* /src/manifest.chrome.json
* /src/ucimesedomaskola.js
* /bin/x.x
* /bin/x.x/ucimesedomaskola-x.x-fx.xpi


## Create new Branch for new version
* Git > Branch/Tag > New Branch
  * Create Branch
    * Branch Name: set branch name aka 2.3
    * Revision: select from what aka 2.2
    * [Create]
    * [x] Checkout Created Branch


## Test functionality in web browsers
UcimeSeDoMaSkola/tmp/buildaddon.sh -a update


## Build new package
UcimeSeDoMaSkola/tmp/buildaddon.sh -a build -v x.x


## Commit and Push your code
### Commit
* Git > Commit
  * Commit messages: description of delivered changes
  * Author: make sure of correct author listed
  * Commiter: make sure of correct commiter is listed
  * Files to commit: exclude those files not part of current commit
  * [Commit]


### Push
* Git > Remote > Push...
  * Remote Repository
    * [x] Select Configured Git Repository Location: origin:https://xxxxx@github.com/jpachta/hello-world.git
    * [Next]
    * [Next]
  * Select local Branches
    * [x] x.x -> x.x [A]
    * [Next]
  * Update Local References
    * Remote Branches
    * [x] x.x -> origin/x.x [A]
    * [Finish]
  * Set Up Remote Tracking?
    * Branch "origin/x.x" created locally.\\
    * Do you want to set up branch "x.x" to track the remote branch?
    * [Yes]


## Publish your new add-on
* FireFox https://addons.mozilla.org/en-US/developers/addons
* Chrome: https://chrome.google.com/webstore/devconsole/


## Manual update for Firefox
* Wait for the review and then download new *-fx.xpi file from Manage Status & Versions > Version x.x
* Commit and Push the /bin/x.x/*-fx.xpi


## Compare and pull request
* On github.com
  * [Compare & pull request]
  * Open a pull request
    * Base: master <- compare: x.x Able to merge
      * Title: x.x
      * Comment: x.x describe what have been done on this change
      * [Create pull request]
  * To be continue...

## Merge Branch with master Branch
To be updated