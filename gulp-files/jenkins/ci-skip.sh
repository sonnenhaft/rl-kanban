# Skip  version bump commits
if [[ $(git show $GIT_COMMIT | grep "ci skip" | wc -m) -ne 0 ]] ; then
  echo "version bump - skipping this commit"
  # sed in here udpates timestamp attribute in junit.xml file, 
  # to junit task does not fail the build 
  sed -i.bak s/timestamp=\"[T0-9:\-]*/timestamp=\"$(date +"%Y-%m-%dT%T")/g coverage/*/junit.xml         
  exit 0
else
  echo "ok to build"
fi