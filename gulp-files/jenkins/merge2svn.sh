let $# || { echo "Usage: merge2svn.sh [PATH_TO_GIT_REPO] [PATH_TO_SVN_REPO] [--test]"; exit 1; }  # Exit if no arguments!

pushd $2
#cause an error if there is no app directory
ls app >/dev/null
svn revert -R .
svn up

# remove uncommited files
svn st | grep '^?' | awk '{print $2}' | xargs rm -rf
cp -r $1/app/ app/
cp -r $1/docs/ docs/
cp -r $1/package.json package.json
cp -r $1/gulpfile.js gulpfile.js
cp -r $1/index-inject.html index-inject.html
cp -r $1/bower.json bower.json
cp -r $1/README.md README.md
cp -r $1/gulp-files  gulp-files

# clean up temp files
find . -name "*.swo" -type f -delete
find . -name "*.swp" -type f -delete

svn add --force app

svn st > merge.diff
svn diff >> merge.diff

pushd $1
#strip lines and spaces from last git commit message
msg=$(git log -n 2 | tail -1 | xargs)
popd

echo "svn commit -m \"$msg\"" 
if [ "$3" != "--test" ]; then
  svn commit -m "auto-merge: $msg" 
fi

popd
