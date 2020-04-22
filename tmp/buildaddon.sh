#!/bin/bash

# https://www.lifewire.com/pass-arguments-to-bash-script-2200571
# https://ryanstutorials.net/bash-scripting-tutorial/bash-variables.php
# https://wiki.pachta.eu/linux/solutions/arguments

FIREFOX_URL="https://addons.mozilla.org/en-US/developers/addons"
CHROME_URL="https://chrome.google.com/webstore/devconsole/"


if [ $# -eq 0 ]; then
  echo "${0##*/}: missing parameter"
  echo "Try ${0##*/} --help"
  echo
  exit
fi

function print_help(){
  echo "Usage: ${0##*/} -a <build|update> -v <version>"
  echo "Update Chrome repository and optionally Builds webextension .zip files"
  echo " "
  echo "  -a         Action to execute use <build|update>"
  echo "  -v         Version of the build <2.1|2.3|...> Version is mandatory with 'build' action"
  echo "  --help     Prints help for this script and exit"
  echo "  --history  Prints history of this script and exit"
  echo " "
  echo "Example: ${0##*/} -a update"
  echo "Example: ${0##*/} -a build -v 2.1"
  echo ""
  echo "Credentials"
  echo "Created by jpachta@centrum.cz"
  echo "Version: 2020-04-22"
  echo ""
  exit
}

function print_history(){
  echo "History:"
  echo "2020-04-22 added URLs to Firefox and Chrome"
  echo "2020-04-22 updated help with supported atributes"
  echo "2020-04-22 removed unnecessary rm command"
  echo "2020-04-14 very first version a 'prove of concept'"
  echo ""
  exit
}

if [ "$1" = "--help" ]; then
  print_help
fi
if [ "$1" = "--history" ]; then
  print_history
fi



function update_chrome() {
  echo -n "Updating Chrome repository... "
  rm -rf ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/*
  cp -rf ~/NetBeansProjects/UcimeSeDoMaSkola/src/* ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/
  mv -f ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/manifest.chrome.json ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/manifest.json
  echo "Done"
}

function build_zips() {
  VERSION=$1
  update_chrome
  echo "Ziping webextension both for Firefox and Chrome with version $VERS.."
  cd ~/NetBeansProjects/UcimeSeDoMaSkola/src/
  zip -r -FS ../tmp/ucimesedomaskola.$VERSION.zip * --exclude *.git* --exclude *.original*
  cd ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/
  zip -r -FS ../../tmp/ucimesedomaskola.chrome.$VERSION.zip * --exclude *.git* --exclude *.original*
  echo "Listing .zip"
  ls -la ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/*.$VERSION.zip
  echo " "
  echo "Publish your new addon on:"
  echo "FireFox "$FIREFOX_URL
  echo "Chrome: "$CHROME_URL
}


while getopts a:v:b:u option
do
case "${option}"
in
a) ACTION=${OPTARG};;
v) VERSION=${OPTARG};;
b) BUILD=${OPTARG};;
u) UPDATE=${OPTARG};;
esac
done

#echo "Action: $ACTION"
#echo "Version: $VERSION"
#echo "BUILD: $BUILD"
#echo "UPDATE: $UPDATE"


if [ "$ACTION" = "build" ]; then
  # check version
  if [ -n "$VERSION" ]; then
    #  build_zips
    echo "Version: $VERSION"
  else
    echo "${0##*/}: missing parameter <version>"
    echo "Try ${0##*/} --help"
    exit
  fi
    build_zips $VERSION
fi



if [ "$ACTION" = "update" ]; then
  #  update_chrome
  update_chrome
fi

exit

