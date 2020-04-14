#!/bin/bash

# https://www.lifewire.com/pass-arguments-to-bash-script-2200571
# https://ryanstutorials.net/bash-scripting-tutorial/bash-variables.php
# https://wiki.pachta.eu/linux/solutions/arguments

if [ $# -eq 0 ]; then
  echo "${0##*/}: missing parameter"
  echo "Try ${0##*/} --help"
  echo
  exit
fi

function print_help(){
  echo "Usage: ${0##*/} [action] <version>"
  echo "Update Chrome repository and optionally Builds webextension .zip files"
  echo " "
  echo "      --help     display this help and exit"
  echo "  -a  --action   an action to execute"
  echo "  -b, --build    prints only 'state' and 'percentage' information followed by <version> such as 2.1"
  echo "  -u, --update   notification of 'brief' output"
  echo ""
  echo "Credentials"
  echo "Created by jpachta@centrum.cz"
  echo "History:"
  echo "2020-04-14 very first version a 'prove of concept'"
  echo ""
  exit
}

if [ "$1" = "--help" ]; then
  print_help
fi


function update_chrome() {
  echo -n "Updating Chrome repository... "
  rm -rf ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/*
  cp -rf ~/NetBeansProjects/UcimeSeDoMaSkola/src/* ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/
  mv -f ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/manifest.chrome.json ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/manifest.json
  rm ~/NetBeansProjects/UcimeSeDoMaSkola/tmp/chrome/updates.json
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

