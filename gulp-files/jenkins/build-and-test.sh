npm install && bower install
echo "######## bumping version ########"
newversion=$(npm version patch --no-git-tag-version)
git add -u
git commit -m "Jenkins: version bump to $newversion [ci skip]"
echo "######## bumping bumped to $newversion  ########"
gulp build && gulp test