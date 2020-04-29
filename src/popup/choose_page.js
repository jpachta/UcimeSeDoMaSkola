/**
 * This script handles popup related activities aka popup background
 * @author Jindrich Pachta
 * @version 2.4 2020-04-22 added popup menu
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Add_a_button_to_the_toolbar
 */
document.addEventListener("click", function(e) {

  // Enable/disable debug mode
  var DEBUG = false;

  // Show me more
  //if(DEBUG)  console.log(e);
  if(DEBUG)  console.log(e.srcElement.dataset.action);
  if(DEBUG)  console.log(e.srcElement.dataset.url);
  if(DEBUG)  console.log(e.target.classList);

  // Do nothing if not page-choice
  if (e.target.classList.contains("page-choice")
      ||
      e.target.classList.contains("page-choice-inactive")) {

  }
  else{
    return;
  }

  if(DEBUG)  console.log("passed");

  switch(e.srcElement.dataset.action){
    case "reload":
      if(DEBUG)  console.log("reloading");
      if(typeof chrome === "object"){
        //browser.runtime.reload();
      }
      else if(typeof browser === "object"){
        //browser.runtime.reload();
      }
      break;
    case "navigate":
      if(DEBUG)  console.log("navigating");
      var chosenPage = e.srcElement.dataset.url;

      if(typeof chrome === "object"){
        chrome.tabs.create({
          url: chosenPage
        });
      }
      else if(typeof browser === "object"){
        browser.tabs.create({
          url: chosenPage
        });
      }
      break;
  }

});


// self executing function here
document.addEventListener("DOMContentLoaded", function(event) {

  function translate(message){
    if(typeof chrome === "object"){
      return chrome.i18n.getMessage(message);
    }
    if(typeof browser === "object"){
      return browser.i18n.getMessage(message);
    }
  }

  // translate text in popoup menu
  var chooseDiv = document.getElementById("chooseDiv");

  for (var i = 0 ; i< chooseDiv.children.length; i++){
    if(typeof chooseDiv.children[i].dataset.msg === 'undefined') {
      continue;
    }
    var msg = translate(chooseDiv.children[i].dataset.msg);
    chooseDiv.children[i].innerText = msg;
  }
});