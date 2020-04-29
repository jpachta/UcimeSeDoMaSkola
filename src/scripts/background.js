/**
 *
 * What it does:
 * - add actions to add-on button
 *
 * A background script of the WebExtension.
 * @author Jindrich Pachta
 * @version 2020-04-27 init version
 *
 * @see Add a button to the toolbar: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Add_a_button_to_the_toolbar
 * @see Toolbar button: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Browser_action
 *
 *
 * Update browser_action in manifest.json to support toolbar icon:
  "browser_action": {
    "default_icon": {
      "128": "icons/ucimesedomaskola-128.png"
    }
  },
 */

/**
 * Action to reload the WebExtension.
 * Only for addon development!
 * @returns {undefined}
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/reload
 */
//function reloadAddon(){
//  browser.runtime.reload()
//}

/**
 * Add action to the Extension button
 */
//browser.browserAction.onClicked.addListener(function(e){
//  reloadAddon();
//});


//function openPage() {
//  browser.tabs.create({
//    url: "http://www.maskola.cz/cz-informace-pro-tridy"
//  });
//}
//
//browser.browserAction.onClicked.addListener(openPage);
//
//
//let loadTime = new Date();
//let manifest = browser.runtime.getManifest();
//
//function onInstalledNotification(details) {
//  browser.notifications.create('onInstalled', {
//    title: `Runtime Examples version: ${manifest.version}`,
//    message: `onInstalled has been called, background page loaded at ${loadTime.getHours()}:${loadTime.getMinutes()}`,
//    type: 'basic'
//  });
//}
//
//function onClick() {
//  browser.runtime.reload();
//}
//
//browser.browserAction.onClicked.addListener(onClick);
//browser.runtime.onInstalled.addListener(onInstalledNotification);