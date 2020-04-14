/* global sample_tridy */

/**
 * What it does:
 * - add checkboxes to all headers and bodies of accordeon
 * - toggle color of the selected heades and bodies of accordeon
 * - keep the settigns in locale storage
 * @author Jindrich Pachta
 * @version 2.1 2020-04-14 reorganized structure of github repository.
 * @version 2.0 2020-04-14 fixed typo in cs translation; changed icons of done and pinned tasks; renamed pin to bell
 * @version 1.4.5 2020-04-12 Update test
 * @version 1.4.4 2020-04-12 Disabled browserAction both in manifest and updates; altered browser_specific_settings with id and strict_min_version
 * @version 1.4.3 2020-04-12 updated cs localization; testing updates
 * @version 1.4 2020-04-10 added upgrading the extension; locale en, cs; toolbar; new icon
 * @version 1.3 2020-04-09 complete rewritten; added toolbox; added style file;
 * @version 1.2 2020-04-07 fixed bug with doubleclick
 * @version 1.1 2020-04-07 changed URL scope to single page
 * @version 1.0 2020-04-07 very first version && This is my very first extension for FireFox :)
 *
 * @done Create toolbar to done,pin,delete/hide pannel next to calendar date
 * @done Get rid of checkboxes - use favicons: trash, star, star-o, eye-slash, bookmark
 * @done Add toolbar above accordion with [] Skryt tridy bez hvezdicky, [] zobrazit vsechny ukoly
 *
 * @todo Update procedure!
 * @todo Create a config page to set remove non favorits tridy, undelete tasks, empty storage, link to help, etc.
 * @todo Add new Bootstrap css, and use gray mode for done tasks
 * @todo obnovit tlacitko na taskbar
 *
 * @see Browser Extensions: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 * @see Updating your extension: https://extensionworkshop.com/documentation/manage/updating-your-extension/
 * @see Example Firefox add-ons: https://github.com/mdn/webextensions-examples
 *
 *
 * @see Project home: https://github.com/jpachta/UcimeSeDoMaSkola
 *
 */


$(document).ready(function() {

  // Enable/disable debug mode
  var DEBUG = false;
  var DEBUG_FULL = false;
  var SAMPLETRIDY = false;

  if(DEBUG)  console.log('DEBUG mode ENABLED on ucimesedomaskola');
  if(DEBUG && DEBUG_FULL) console.log("DEBUG FULL mode ENABLED on ucimesedoma.maskola.cz");
  if(DEBUG)  document.body.style.border = "15px solid red";
  //console.log("ucimesedoma.maskola.cz");



  // var title = browser.i18n.getMessage("notificationTitle");
  // var content = browser.i18n.getMessage("notificationContent", message.url);

  if(SAMPLETRIDY){
    if(DEBUG)  console.log("Loading sample tridy.");
    $('#accordion1').html(sample_tridy);
    $('#accordion2').remove();
  }

  function translate(message){
    return browser.i18n.getMessage(message);
  }


  ///
  /// Storage handler
  ///

  // Check availability of the storage for settings
  if (typeof(Storage) !== "undefined") {
    //console.log('Code for localStorage/sessionStorage.');
  } else {
    //console.log('Sorry! No Web Storage support..');
    alert(translate("storageAlert"));
  }


  // Get settings from storage
  var pref_ukoly_del = JSON.parse(localStorage.getItem("pref_ukoly_del"));
  if(pref_ukoly_del === null){
    var pref_ukoly_del = [];
  }
  var pref_ukoly_bell = JSON.parse(localStorage.getItem("pref_ukoly_bell"));
  if(pref_ukoly_bell === null){
    var pref_ukoly_bell = [];
  }
  var pref_ukoly_done = JSON.parse(localStorage.getItem("pref_ukoly_done"));
  if(pref_ukoly_done === null){
    var pref_ukoly_done = [];
  }
  var pref_ukoly_hide = JSON.parse(localStorage.getItem("pref_ukoly_hide"));
  if(pref_ukoly_hide === null){
    var pref_ukoly_hide = [];
  }

  var pref_tridy_fav = JSON.parse(localStorage.getItem("pref_tridy_fav"));
  if(pref_tridy_fav === null){
    var pref_tridy_fav = [];
  }
  var pref_tridy_rem = JSON.parse(localStorage.getItem("pref_tridy_rem"));
  if(pref_tridy_rem === null){
    var pref_tridy_rem = false;
  }

  if(DEBUG){
    console.log('Preferrences: ');
    console.log(pref_tridy_fav);
    console.log(pref_tridy_rem);
    console.log(pref_ukoly_del);
    console.log(pref_ukoly_bell);
    console.log(pref_ukoly_done);
  }

  var tridy_list = {};
  var ukoly_list = {};

  var toolbar_ukol = {
    main: {
      id: 'usd_panel_UID',
      class: 'usd_panel',
      icon: '',
      iconin: '',
      title: translate('toolbarTitleMain'),
      dataid: 'UID',
      dataact: ''
    },
    done: {
      id: 'usd_done_UID',
      class: 'usd_toolbar_icon',
      icon: 'fa fa-square-o',
      iconin: 'fa fa-check-square-o',
      title: translate('toolbarTitleDone'),
      dataid: 'UID',
      dataact: 'done'
    },
//    hide: {
//      id: 'usd_hide_UID',
//      class: 'usd_toolbar_icon',
//      icon: 'fa fa-minus-square-o',
//      iconin: 'fa fa-plus-square-o',
//      title: translate('toolbarTitleHide'),
//      dataid: 'UID',
//      dataact: 'hide'
//    },
    bell: {
      id: 'usd_bell_UID',
      class: 'usd_toolbar_icon',
      icon: 'fa fa-bell-o',
      iconin: 'fa fa-bell',
      title: translate('toolbarTitleBell'),
      dataid: 'UID',
      dataact: 'bell'
    },
    del: {
      id: 'usd_del_UID',
      class: 'usd_toolbar_icon',
      icon: 'fa fa-trash',
      iconin: 'fa fa-trash-o',
      title: translate('toolbarTitleDel'),
      dataid: 'UID',
      dataact: 'del'
    }
  };
  var toolbar_trida = {
    main: {
      id: 'usd_panel_trida_UID',
      class: 'usd_panel_trida',
      icon: '',
      title: translate('toolbarTridaMain'),
      dataid: '',
      dataact: ''
    },
    star: {
      id: 'usd_star_UID',
      class: 'usd_toolbar_icon',
      icon: 'fa fa-star',
      iconin: 'fa fa-star-o',
      title: translate('toolbarTridaStar'),
      dataid: 'UID',
      dataact: 'star'
    }
  };

  var toolbar_page = {
    main: {
      id: 'usd_panel_page',
      class: 'usd_panel_page panel panel-default panel-heading',
      icon: '',
      title: translate('toolbarPageMain'),
      dataid: '',
      dataact: ''
    },
    hide: {
      id: 'usd_panel_page_hide',
      class: 'usd_panel_page usd_toolbar_icon',
      icon: 'fa fa-eye',
      iconin: 'fa fa-eye-slash',
      title: translate('toolbarPageHide'),
      dataid: 'usd_panel_page_hide',
      dataexe: 'hide'
    },
    undelete: {
      id: 'usd_panel_page_undelete',
      class: 'usd_panel_page usd_toolbar_icon',
      icon: 'fa fa-file-text-o',
      iconin: 'fa fa-file-text-o',
      title: translate('toolbarPageUndelete'),
      dataid: 'usd_panel_page_undelete',
      dataexe: 'undelete'
    },
    reset: {
      id: 'usd_panel_page_reset',
      class: 'usd_panel_page usd_toolbar_icon',
      icon: 'fa fa-recycle',
      iconin: 'fa fa-recycle fa-spin',
      title: translate('toolbarPageReset'),
      dataid: 'usd_panel_page_reset',
      dataexe: 'reset'
    }
  }

  panels_ukol = {
    main: '<div id="UID" class="CLASS" title="TITLE">HTML</div>',
    icon: '<div id="UID" class="CLASS" title="TITLE" data-usd-id="DATAID" data-usd-exe="DATEXE"><i class="ICON" aria-hidden="true"></i></div>'
  };

  panels_trida = {
    main: '<div id="UID" class="CLASS" title="TITLE">HTML</div>',
    icon: '<div id="UID" class="CLASS" title="TITLE" data-usd-id="DATAID" data-usd-exe="DATEXE"><i class="ICON" aria-hidden="true"></i></div>'
  };

  panels_page = {
    main: '<div id="UID" class="CLASS" title="TITLE">HTML</div>',
    icon: '<div id="UID" class="CLASS" title="TITLE" data-usd-id="DATAID" data-usd-exe="DATEXE"><i class="ICON" aria-hidden="true"></i></div>'
  };

  panel_icon = '<img id=usd-panel-toolbar-icon" src="'+ addon_icon_128 +'" width=15 height=15>&nbsp;';



  ///
  /// Clear design
  ///

  // Remove tabs
  function removeTabs(){
    var tab_parent = $('#tab1').parent().parent().parent();
    var tab1 = $('#tab1').html();
    var tab2 = $('#tab2').html();
    $(tab_parent).children().remove();
    $(tab_parent).html("<div id=usd_div></div>");
    $(tab_parent).children().html(tab1 + tab2);
    if(DEBUG)  console.log('Tridy tabs were removed');
  }

  // Find all tridy
  function findTridy(){
    $("div[id^='accordion']").each(
        function(i, accordion){
          //if(DEBUG)  console.log($(accordion).children());
          $(accordion).children().each(
              function(y, trida){
                var long_id = $(trida).children().attr('id');
                var trida_id = findTrimId(long_id, 'heading');
                var trida_name = $('div#heading'+ trida_id +' h4 a').text().trim();
                Object.assign(tridy_list, {[trida_id]: {id: trida_id, name: trida_name}});
              });
        }
    );
    if(DEBUG)  console.log('findTridy done tridy_list=');
    if(DEBUG)  console.log(tridy_list );
  }


  // Find all Ukoly
  function findUkoly(){
    $(".panel-body [id^=novTitle").each(
        function(i, ukol){
          var long_id = $(ukol).attr('id');
          var ukol_id = findTrimId(long_id, 'novTitle_');
          var ukol_name = $(ukol).text().trim();
          Object.assign(ukoly_list, {[ukol_id]: {id: ukol_id, name: ukol_name}});
        });
    if(DEBUG)  console.log('ukoly_list:');
    if(DEBUG)  console.log(ukoly_list);
  }

  // Find tridy id
  function findTrimId(string, prefix){
    return string.replace(prefix,'');
  }


  function buildPanelsUkol(toolbar, panels, id){
    if(DEBUG)  console.log('buildPanelsUkol start: toolbar='+toolbar+' panels='+panels+' id='+id);
    var panel = '';
    var code = '';
    var codes = '';
    for(var item in toolbar){
      code = ((item === 'main') ? panels.main : panels.icon);
      code = code.replace(/UID/g, toolbar[item].id);
      code = code.replace(/ICON/g, toolbar[item].icon);
      code = code.replace(/TITLE/g, toolbar[item].title);
      code = code.replace(/CLASS/g, toolbar[item].class);
      code = code.replace(/DATAID/g, toolbar[item].dataid);
      code = code.replace(/DATEXE/g, toolbar[item].dataact);
      if(item === 'main'){
        panel = code;
      }
      else{
        codes = codes + "&nbsp;\n" + code;
      }
    }
    var html = panel.replace(/HTML/g, codes + "\n");
    html = html.replace(/UID/g, id);
    //if(DEBUG)  console.log(html);
    if(DEBUG)  console.log('buildPanelsUkol done.');
    return html;
  }


  function buildPanelsTrida(toolbar, panels, id){
    var panel = '';
    var src = '';
    var codes = '';
    for(var item in toolbar){
      src = ((item === 'main') ? panels.main : panels.icon);
      src = src.replace(/UID/g, toolbar[item].id);
      src = src.replace(/ICON/g, toolbar[item].icon);
      src = src.replace(/TITLE/g, toolbar[item].title);
      src = src.replace(/CLASS/g, toolbar[item].class);
      src = src.replace(/DATAID/g, toolbar[item].dataid);
      src = src.replace(/DATEXE/g, toolbar[item].dataact);
      if(item === 'main'){
        panel = src;
      }
      else{
        codes = codes + "&nbsp;\n" + src;
      }
    }
    var html = panel.replace(/HTML/g, codes);
    html = html.replace(/UID/g, id);
    if(DEBUG)  console.log('buildPanelsTrida done.');
    return html;
  }

  function buildPanelPage(toolbar, panels, id){
    if(DEBUG)  console.log('buildPanelPage start: toolba='+toolbar+' panels='+panels+' id='+id);
    var panel = '';
    var src = '';
    var codes = '';
    for(var item in toolbar){
      src = ((item === 'main') ? panels.main : panels.icon);
      src = src.replace(/UID/g, toolbar[item].id);
      src = src.replace(/ICON/g, toolbar[item].icon);
      src = src.replace(/TITLE/g, toolbar[item].title);
      src = src.replace(/CLASS/g, toolbar[item].class);
      src = src.replace(/DATAID/g, toolbar[item].dataid);
      src = src.replace(/DATEXE/g, toolbar[item].dataexe);
      if(item === 'main'){
        panel = src;
      }
      else{
        codes = codes + "&nbsp;\n" + src;
      }
    }

    codes = panel_icon + translate('toolbarPageMain') +' ' + codes;
    var html = panel.replace(/HTML/g, codes);
    html = html.replace(/UID/g, id);

    if(DEBUG)  console.log('buildPanelPage done.');
    return html;
  }

  function removeTridy(tridy, keep){
    var cnt = 0;
    for(var trida in tridy){
      var index = keep.indexOf(trida);
      if(index === -1){
        $('#heading' + trida).parent().toggle("slow"); //remove();
        cnt++;
      }
      index = null;
    }
    if(DEBUG)  console.log('Removed Tridy '+ cnt +'x');
  }

  function removeUkoly(ukoly){
    var cnt = 0;
    for(ukol=0; ukol<ukoly.length; ukol++){
      $('#novContent_' + ukoly[ukol]).parent().remove();
      cnt++;
    }
    if(DEBUG)  console.log('Remove Ukoly '+ cnt +'x');
  }

  /**
   * Decorate Tridy with toolbar and click action
   * @param tridy array IDs
   * @param favs array IDs
   */
  function updateTridy(tridy, favs){
    for(var trida_id in tridy){
      var panel_trida = buildPanelsTrida(toolbar_trida, panels_trida, trida_id);
      $('#heading'+ trida_id).prepend(panel_trida);
      $('#usd_star_' + trida_id).on( "click", function() {
          toggleTridaStar($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
          if(DEBUG)  console.log($(this).attr('data-usd-id')+' '+$(this).attr('data-usd-exe')+' '+$(this).attr('id'));
      });
    }
    if(DEBUG)  console.log('Decorated Tridy.');
  }

  /**
   * Decorate Ukoly with toolbar and click action
   * @param ukoly array IDs
   */
  function updateUkoly(ukoly){
    if(DEBUG)  console.log('updateUkoly start');
    for(var ukol_id in ukoly){
      var panel_ukol = buildPanelsUkol(toolbar_ukol, panels_ukol, ukol_id);
      $('#novTitle_'+ ukol_id).prepend(panel_ukol);
      $('#usd_done_' + ukol_id).on( "click", function() {
        if(DEBUG)  console.log($(this).attr('data-usd-id')+' '+$(this).attr('data-usd-exe')+' '+$(this).attr('id'));
        toggleUkol($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
      });
      $('#usd_bell_' + ukol_id).on( "click", function() {
        if(DEBUG)  console.log($(this).attr('data-usd-id')+' '+$(this).attr('data-usd-exe')+' '+$(this).attr('id'));
        toggleUkol($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
      });
      $('#usd_del_' + ukol_id).on( "click", function() {
        if(DEBUG)  console.log($(this).attr('data-usd-id')+' '+$(this).attr('data-usd-exe')+' '+$(this).attr('id'));
        toggleUkol($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
      });
      $('#usd_hide_' + ukol_id).on( "click", function() {
        if(DEBUG)  console.log($(this).attr('data-usd-id')+' '+$(this).attr('data-usd-exe')+' '+$(this).attr('id'));
        toggleUkol($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
      });

    }
    if(DEBUG)  console.log('updateUkoly done');
  }

  function toggleUkol(uid, kind, id){
    if(DEBUG)  console.log('toggleUkol start: '+uid+' '+kind+' '+id );
    switch(kind){
    case 'done':
      var index = pref_ukoly_done.indexOf(uid);
      if(index > -1){
        updateUkolyAction([uid], kind, 'rem');
      }
      else{
        updateUkolyAction([uid], kind, 'add');
      }
      break;
    case 'bell':
      var index = pref_ukoly_bell.indexOf(uid);
      if(index > -1){
        updateUkolyAction([uid], kind, 'rem');
      }
      else{
        updateUkolyAction([uid], kind, 'add');
      }
      break;
    case 'del':
      var index = pref_ukoly_del.indexOf(uid);
      if(index > -1){
        updateUkolyAction([uid], kind, 'rem');
      }
      else{
        updateUkolyAction([uid], kind, 'add');
      }
      break;
    case 'hide':
      var index = pref_ukoly_hide.indexOf(uid);
      if(index > -1){
        updateUkolyAction([uid], kind, 'rem');
      }
      else{
        updateUkolyAction([uid], kind, 'add');
      }
      break;
    }
    if(DEBUG)  console.log('toggleUkol done.');
  }

  function updateUkolyAction(ukoly, kind, action){
    if(DEBUG)  console.log('updateUkolyAction start: ukoly='+ukoly+' kind='+kind+' id='+action);
    for(i=0; i<ukoly.length; i++){
      var ukol_id = null;
      ukol_id = ukoly[i];
      switch (kind){
        case 'undefined': break;
        case 'done':
          $('#usd_done_'+ ukol_id).toggleClass('usd_darkred');
          $('#novContent_'+ ukol_id).toggleClass('usd_bg_lightgreen');
          $('#novContent_'+ ukol_id).next().toggleClass('usd_bg_lightgreen');
          switch(action){
            case 'add':
              var index = pref_ukoly_done.indexOf(ukol_id);
              if(DEBUG)  console.log('updateUkolyAction add found at index='+ index);
              if (index === -1) {
                pref_ukoly_done.push(ukol_id);
              }
              localStorage.setItem('pref_ukoly_done', JSON.stringify(pref_ukoly_done));
              $('#usd_done_'+ ukol_id +' i').toggleClass(toolbar_ukol.done.iconin);
              $('#usd_done_'+ ukol_id +' i').toggleClass(toolbar_ukol.done.icon);
              $('#novContent_'+ ukol_id).slideUp();
              $('#novContent_'+ ukol_id).next().slideUp();
              break;
            case 'rem':
              var index = pref_ukoly_done.indexOf(ukol_id);
              if(DEBUG)  console.log('updateUkolyAction rem found at index='+ index);
              if (index > -1) {
                pref_ukoly_done.splice(index, 1);
              }
              localStorage.setItem('pref_ukoly_done', JSON.stringify(pref_ukoly_done));
              $('#usd_done_'+ ukol_id +' i').toggleClass(toolbar_ukol.done.icon);
              $('#usd_done_'+ ukol_id +' i').toggleClass(toolbar_ukol.done.iconin);
              $('#novContent_'+ ukol_id).slideDown();
              $('#novContent_'+ ukol_id).next().slideDown();
              break;
          }
          if(DEBUG)  console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;

        case 'bell':
          $('#usd_bell_'+ ukol_id).toggleClass('usd_darkred');
          //$('#novContent_'+ ukol_id).toggleClass('usd_bg_lightgreen');
          //$('#novContent_'+ ukol_id).parent().toggleClass('panel-info');
          $('#novContent_'+ ukol_id).toggleClass('aler-info');
          switch(action){
            case 'add':
              var index = pref_ukoly_bell.indexOf(ukol_id);
              if (index === -1) {
                pref_ukoly_bell.push(ukol_id);
              }
              localStorage.setItem('pref_ukoly_bell', JSON.stringify(pref_ukoly_bell));
              $('#usd_bell_'+ ukol_id+' i').toggleClass(toolbar_ukol.bell.iconin);
              $('#usd_bell_'+ ukol_id+' i').toggleClass(toolbar_ukol.bell.icon);
            break;
            case 'rem':
              var index = pref_ukoly_bell.indexOf(ukol_id);
              if(DEBUG)  console.log('updateUkolyAction rem found at index='+ index);
              if (index > -1) {
                pref_ukoly_bell.splice(index, 1);
              }
              localStorage.setItem('pref_ukoly_bell', JSON.stringify(pref_ukoly_bell));
              $('#usd_bell_'+ ukol_id+' i').toggleClass(toolbar_ukol.bell.icon);
              $('#usd_bell_'+ ukol_id+' i').toggleClass(toolbar_ukol.bell.iconin);
            break;
          }
          if(DEBUG)  console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;

        case 'del':
          $('#novContent_'+ ukol_id).parent().fadeOut(100).fadeIn(100).fadeOut(100);
          switch(action){
            case 'add':
              var index = pref_ukoly_del.indexOf(ukol_id);
              if (index === -1) {
                pref_ukoly_del.push(ukol_id);
              }
              localStorage.setItem('pref_ukoly_del', JSON.stringify(pref_ukoly_del));
            break;
            case 'rem':
              var index = pref_ukoly_del.indexOf(ukol_id);
              if(DEBUG)  console.log('updateUkolyAction rem found at index='+ index);
              if (index > -1) {
                pref_ukoly_del.splice(index, 1);
              }
              localStorage.setItem('pref_ukoly_del', JSON.stringify(pref_ukoly_del));
            break;
          }
          if(DEBUG)  console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;

        case 'hide':
          $('#usd_hide_'+ ukol_id).toggleClass('usd_darkred');
          $('#novContent_'+ ukol_id).toggleClass('usd_hide');
          $('#novContent_'+ ukol_id).siblings('.panel-footer').toggleClass('usd_hide');
          $('#novContent_'+ ukol_id).next().next().toggleClass('usd_hide');
          switch(action){
          case 'add':
            var index = pref_ukoly_hide.indexOf(ukol_id);
            if (index === -1) {
              pref_ukoly_hide.push(ukol_id);
            }
            localStorage.setItem('pref_ukoly_hide', JSON.stringify(pref_ukoly_hide));
            break;
          case 'rem':
            var index = pref_ukoly_hide.indexOf(ukol_id);
            console.log(index);
            if (index > -1) {
              pref_ukoly_hide.splice(index, 1);
            }
            localStorage.setItem('pref_ukoly_hide', JSON.stringify(pref_ukoly_hide));
            break;
          }
          if(DEBUG)  console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;
        case 'done':break;
      }
    }
  }

  /**
   * Toggle classes and add/remove from storage
   * @param tridy array IDs
   * @param action string action
   */
  function updateTridyStared(tridy, action){
    if(DEBUG)  console.log('updateTridyStared: tridy='+tridy+' action='+action);
    for(i = 0; i<tridy.length; i++){
      $('#usd_star_'+ tridy[i]).toggleClass('usd_darkred');
      $('#heading'+ tridy[i]).parent().toggleClass('panel-primary');
      //$('#heading'+ tridy[i]).toggleClass('usd_bg_darkpink');
      //$('#collapse'+ tridy[i]).toggleClass('usd_bg_pink');
      //$('#collapse'+ tridy[i]).collapse('show');
      if(DEBUG)  console.log('updateTridyStared: tridy='+tridy+' action='+action+' tridy[i]='+tridy[i]);
      switch(action){
        case 'undefined': break;
        case 'add':
          var index = pref_tridy_fav.indexOf(tridy[i]);
          if (index === -1) {
            pref_tridy_fav.push(tridy[i]);
          }
          localStorage.setItem('pref_tridy_fav', JSON.stringify(pref_tridy_fav));
          break;
        case 'rem':
          var index = pref_tridy_fav.indexOf(tridy[i]);
          if (index > -1) {
            pref_tridy_fav.splice(index, 1);
          }
          localStorage.setItem('pref_tridy_fav', JSON.stringify(pref_tridy_fav));
//          $('#collapse'+ tridy[i]).collapse();
          break;
        }
    }
    if(DEBUG)  console.log('Updated Tridy stars.');
  }

  /**
   * @param {integer} uid UID
   * @param {integer} kind description
   * @param {integer} id neco
   */
  function toggleTridaStar(uid, kind, id){
    if(DEBUG)  console.log( 'toggleTridaStar: '+uid+' '+kind+' '+id );
    var index = pref_tridy_fav.indexOf(uid);
    if(index > -1){
      updateTridyStared([uid], 'rem');
    }
    else{
      updateTridyStared([uid], 'add');
    }
    if(DEBUG)  console.log('Updated Tridy star actions.');
  }


  function updatePanelPage(){
    //for(i=0; i<toolbar_page.lenght-1; i++){
      var panel_page = buildPanelPage(toolbar_page, panels_page);
      $('#usd_div').prepend(panel_page);
      $('#usd_panel_page_hide').on( "click", function() {
          if(DEBUG)  console.log('updatePanelPage data-usd-id='+$(this).attr('data-usd-id')+' data-usd-exe='+$(this).attr('data-usd-exe')+' id='+$(this).attr('id'));
          togglePanelIcon($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
      });
      $('#usd_panel_page_undelete').on( "click", function() {
          if(DEBUG)  console.log('updatePanelPage data-usd-id='+$(this).attr('data-usd-id')+' data-usd-exe='+$(this).attr('data-usd-exe')+' id='+$(this).attr('id'));
          togglePanelIcon($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
      });
      $('#usd_panel_page_reset').on( "click", function() {
          if(DEBUG)  console.log('updatePanelPage data-usd-id='+$(this).attr('data-usd-id')+' data-usd-exe='+$(this).attr('data-usd-exe')+' id='+$(this).attr('id'));
          togglePanelIcon($(this).attr('data-usd-id'), $(this).attr('data-usd-exe'), $(this).attr('id'));
      });
    //}
    if(DEBUG)  console.log('updatePanelPage done.');
  }

  function togglePanelIcon(id, action){
    if(DEBUG)  console.log('togglePanelIcon start: id='+id+' action='+action);
    switch (id) {
      case 'usd_panel_page_hide':
        if(pref_tridy_rem){
          updatePageIcon(id, 'rem');
        }
        else{
          updatePageIcon(id, 'add');
        }
        break;

      case 'usd_panel_page_undelete':
      case 'usd_panel_page_reset':
        // if any setting, then red and action
        if(false
                ||pref_tridy_rem
                || pref_tridy_fav.length
                || pref_ukoly_del.length
                || pref_ukoly_done
                || pref_ukoly_bell
                ){
          updatePageIcon(id, 'act');
                }
        break;
    }
    if(DEBUG)  console.log('togglePanelIcon done');
  }

  function updatePageIcon(icon, action){
    if(DEBUG)  console.log('updatePageIcon start: id='+icon+' action='+action);
    switch(icon){
      case 'usd_panel_page_hide':
        switch(action){
          case 'undefined': break;
          case 'add':
          case 'rem':
            pref_tridy_rem = !pref_tridy_rem;
            localStorage.setItem('pref_tridy_rem', JSON.stringify(pref_tridy_rem));
            $('#'+ icon +' i').toggleClass('fa-eye-slash');
            $('#'+ icon +' i').toggleClass('fa-eye');
            $('#'+ icon).toggleClass('usd_darkred');
            removeTridy(tridy_list, pref_tridy_fav);
            break;
          case 'load':
            if(pref_tridy_rem){
              $('#'+ icon).toggleClass('usd_darkred');
              $('#'+ icon +' i').toggleClass('fa-eye-slash');
              $('#'+ icon +' i').toggleClass('fa-eye');
            }
            break;
          }
        break;
      case 'usd_panel_page_undelete':
        switch (action) {
          case 'load':
            if(DEBUG)  console.log('updatePageIcon usd_panel_page_undelete: id='+icon+' action='+action);
            if(pref_ukoly_del.length){
              $('#usd_panel_page_undelete').toggleClass('usd_darkred');
            }
            break;
          case 'act':
            if(DEBUG)  console.log('updatePageIcon usd_panel_page_undelete: id='+icon+' action='+action);
            $('#usd_panel_page_undelete').toggleClass('usd_darkred');
            pref_ukoly_del = [];
            localStorage.setItem('pref_ukoly_del', JSON.stringify(pref_ukoly_del));
            location.reload();// FIXME not to refresh whole page
            break;
        }
        break;
      case 'usd_panel_page_reset':
        switch (action) {
          case 'load':
            if(DEBUG)  console.log('updatePageIcon usd_panel_page_undelete: id='+icon+' action='+action);
            if(false
                    || pref_ukoly_del.length
                    || pref_ukoly_done.length
                    || pref_ukoly_hide.length
                    || pref_ukoly_bell.length
                    || pref_tridy_fav.length
                    || pref_tridy_rem.length
            ){
              $('#usd_panel_page_undelete').toggleClass('usd_darkred');
            }
            break;
          case 'act':
            if(DEBUG)  console.log('updatePageIcon usd_panel_page_reset: id='+icon+' action='+action);
            $('#usd_panel_page_reset i').toggleClass('usd_darkred');
            localStorage.clear();
            location.reload();
            break;
        }
        break;
      }
    if(DEBUG)  console.log('updatePageIcon done');
  }



  function resetOtherTridy(){
    if(DEBUG)  console.log();
  }


  function dummy(){
    if(DEBUG)  console.log();
  }

  ///
  /// Main loop
  ///

  // # remove tabs to show all Tridy at once
  removeTabs();

  // # list all Tridy
  findTridy();

  /// # remove non-favorite tridy
  if(pref_tridy_rem){
    removeTridy(tridy_list, pref_tridy_fav);
  }

  /// # remove trashed ukoly
  removeUkoly(pref_ukoly_del);


  /// # decorate tridy with toolbars
  updateTridy(tridy_list, pref_tridy_fav);


  // # colorize stars and head and body of stared Tridy
  updateTridyStared(pref_tridy_fav);


  // # Find all ukoly
  findUkoly();


  // #  decorate ukoly with toolbars
  updateUkoly(ukoly_list);


  // # colorize icons head and body of stared Ukoly
  updateUkolyAction(pref_ukoly_done, 'done', 'add');
  updateUkolyAction(pref_ukoly_bell, 'bell', 'add');
  updateUkolyAction(pref_ukoly_del, 'del', 'add');
  updateUkolyAction(pref_ukoly_hide, 'hide', 'add');

  // # panel page
  updatePanelPage();
  updatePageIcon('usd_panel_page_hide', 'load');
  updatePageIcon('usd_panel_page_undelete', 'load');
  updatePageIcon('usd_panel_page_reset', 'load');
});
