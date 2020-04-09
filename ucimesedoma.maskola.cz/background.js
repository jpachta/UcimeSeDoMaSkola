/**
 * DRAFT
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Add_a_button_to_the_toolbar
 * @returns
 */

/*
function openPage() {
  browser.tabs.create({
    url: "https://developer.mozilla.org"
  });
}
browser.browserAction.onClicked.addListener(openPage);
*/

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/reload
function reloadAddon(){
  browser.runtime.reload()
}

//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Browser_action
browser.browserAction.onClicked.addListener(function(e){
  reloadAddon();
});
