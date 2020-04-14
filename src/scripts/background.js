/**
 * A background script of the WebExtension.
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
