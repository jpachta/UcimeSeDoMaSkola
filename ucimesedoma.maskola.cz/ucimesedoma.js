/**
 * This is my very first extension for FireFox :)
 * What it does:
 * - add checkboxes to all headers and bodies of accordeon 
 * - toggle color of the selected heades and bodies of accordeon 
 * - keep the settigns in locale storage
 * @author Jindrich Pachta
 * @version 1.3 2020-04-09 complete rewritten; added toolbox; added style file;
 * @version 1.2 2020-04-07 fixed bug with doubleclick
 * @version 1.1 2020-04-07 changed URL scope to single page
 * @version 1.0 2020-04-07 very first version
 * 
 * @done Create toolbar to done,pin,delete/hide pannel next to calendar date
 * @done Get rid of checkboxes - use favicons: trash, star, star-o, eye-slash, bookmark
 * 
 * @todo Create a config page to set remove non favorits tridy, undelete tasks, empty storage
 * @todo 
 * @todo 
 */

$(document).ready(function() {
  
  // Enable/disable debug mode
  var DEBUG = false;
  var DEBUG_FULL = false;
  
  if(DEBUG)  console.log("DEBUG mode ENABLED on ucimesedoma.maskola.cz");
  if(DEBUG && DEBUG_FULL) console.log("DEBUG FULL mode ENABLED on ucimesedoma.maskola.cz");
  if(DEBUG) document.body.style.border = "15px solid red";
  //console.log("ucimesedoma.maskola.cz");
  
  

  // demo tridy
  html = "" +
  "<div class='panel panel-default'>"+
  "<div class='panel-heading' role='tab' id='heading34'>"+
  "<h4 class='panel-title'>"+
  "<a data-toggle='collapse' data-parent='#accordion1' href='#collapse34' aria-expanded='true' aria-controls='collapse34' class='collapsed'>I. A</a></h4></div>"+
  "<div id='collapse34' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading34'>"+
  "<div class='panel-body'>"+
  "<div class='panel panel-success'>"+
  "<div class='panel-heading'>"+
  "<span class='pull-right'><i class='glyphicon glyphicon-calendar'></i> 03.09.2019</span>"+
  "<h3 class='panel-title' id='novTitle_548'>Třídní stránky</h3></div>"+
  "<div class='panel-body' id='novContent_548'><p>http://maskolaci.mozello.cz/</p></div>"+
  "<div class='panel-footer'>Vložil: Pavla Kadlecová</div></div></div></div></div>"
  +
  "<div class='panel panel-default'>"+
  "<div class='panel-heading' role='tab' id='heading35'>"+
  "<h4 class='panel-title'>"+
  "<a data-toggle='collapse' data-parent='#accordion1' href='#collapse35' aria-expanded='true' aria-controls='collapse35' class='collapsed'>I. B</a></h4></div>"+
  "<div id='collapse35' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading35'>"+
  "<div class='panel-body'>"+
  "<div class='panel panel-success'>"+
  "<div class='panel-heading'>"+
  "<span class='pull-right'><i class='glyphicon glyphicon-calendar'></i> 03.09.2019</span>"+
  "<h3 class='panel-title' id='novTitle_1527'>Třídní stránky</h3></div>"+
  "<div class='panel-body' id='novContent_1527'><p>http://maskolaci.mozello.cz/</p></div>"+
  "<div class='panel-footer'>Vložil: Pavla Kadlecová</div></div></div></div></div>"
  +
  "<div class='panel panel-default'>"+
  "<div class='panel-heading' role='tab' id='heading36'>"+
  "<h4 class='panel-title'>"+
  "<a data-toggle='collapse' data-parent='#accordion1' href='#collapse36' aria-expanded='true' aria-controls='collapse36' class='collapsed'>I. C</a></h4></div>"+
  "<div id='collapse36' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading36'>"+
  "<div class='panel-body'>"+
  "<div class='panel panel-success'>"+
  "<div class='panel-heading'>"+
  "<span class='pull-right'><i class='glyphicon glyphicon-calendar'></i> 03.09.2019</span>"+
  "<h3 class='panel-title' id='novTitle_1527a'>Třídní stránky</h3></div>"+
  "<div class='panel-body' id='novContent_1527a'><p>http://maskolaci.mozello.cz/</p></div>"+
  "<div class='panel-footer'>Vložil: Pavla Kadlecová</div></div></div></div></div>"
  ;
//  $('#accordion1').html(html);
//  $('#accordion2').remove();
  
  
  /// 
  /// Storage handler
  /// 
  
  // Check availability of the storage for settings
  if (typeof(Storage) !== "undefined") {
    //console.log('Code for localStorage/sessionStorage.');
  } else {
    //console.log('Sorry! No Web Storage support..');
    alert('Upozornění: rozšíření nemá přístup k úložišti.\nVaše nastavení nebude uloženo.');
  }
  
  // Get settings from storage
  var pref_ukoly_del = JSON.parse(localStorage.getItem("pref_ukoly_del"));
  if(pref_ukoly_del == null){
    var pref_ukoly_del = [];
  }
  var pref_ukoly_pin = JSON.parse(localStorage.getItem("pref_ukoly_pin"));
  if(pref_ukoly_pin == null){
    var pref_ukoly_pin = [];
  }
  var pref_ukoly_done = JSON.parse(localStorage.getItem("pref_ukoly_done"));
  if(pref_ukoly_done == null){
    var pref_ukoly_done = [];
  }
  var pref_ukoly_hide = JSON.parse(localStorage.getItem("pref_ukoly_hide"));
  if(pref_ukoly_hide == null){
    var pref_ukoly_hide = [];
  }

  var pref_tridy_fav = JSON.parse(localStorage.getItem("pref_tridy_fav"));
  if(pref_tridy_fav == null){
    var pref_tridy_fav = [];
  }
  var pref_tridy_rem = JSON.parse(localStorage.getItem("pref_tridy_rem"));
  if(pref_tridy_rem == null){
    var pref_tridy_rem = false;
  }
  
  if(DEBUG){
    console.log('Preferrences: ');
    console.log(pref_tridy_fav);
    console.log(pref_tridy_rem);
    console.log(pref_ukoly_del);
    console.log(pref_ukoly_pin);
    console.log(pref_ukoly_done);
  }
  
  var tridy_list = {};
  var ukoly_list = {};
  
  var toolbar_ukol = {
      main: {
          id: 'usd_panel_UID',
          class: 'usd_panel',
          icon: '',
          title: 'Učíme se doma',
          dataid: 'UID',
          dataact: '',
      },
      done: {
          id: 'usd_done_UID',
          class: 'usd_toolbar_icon',
          icon: 'fa fa-check-square-o',
          title: 'Označit úkol jako hotový',
          dataid: 'UID',
          dataact: 'done',
      },
      hide: {
          id: 'usd_hide_UID',
          class: 'usd_toolbar_icon',
          icon: 'fa fa-minus-square-o',
          iconin: 'fa fa-plus-square-o',
          title: 'Zavřít úkol',
          dataid: 'UID',
          dataact: 'hide',
      },
      pin: {
          id: 'usd_pin_UID',
          class: 'usd_toolbar_icon',
          icon: 'fa fa-thumb-tack',
          iconin: 'fa fa-thumb-tack',
          title: 'Zvýraznit důležitý úkol',
          dataid: 'UID',
          dataact: 'pin',
      },
      del: {
          id: 'usd_del_UID',
          class: 'usd_toolbar_icon',
          icon: 'fa fa-trash',
          iconin: 'fa fa-trash-o',
          title: 'Trvale smazat úkol',
          dataid: 'UID',
          dataact: 'del',
      },
  };
  var toolbar_trida = {
      main: {
          id: 'usd_panel_trida_UID',
          class: 'usd_panel_trida',
          icon: '',
          title: 'Učíme se doma',
          dataid: '',
          dataact: '',
      },
      star: {
        id: 'usd_star_UID',
        class: 'usd_toolbar_icon',
        icon: 'fa fa-star',
        iconin: 'fa fa-star-o',
        title: 'Oblíbená třída',
        dataid: 'UID',
        dataact: 'star',
      }
  };

  panels_ukol = {
    'main': '<div id="UID" class="CLASS" title="TITLE">HTML</div>',
    'icon': '<div id="UID" class="CLASS" title="TITLE" data-usd-id="DATAID" data-usd-exe="DATEXE"><i class="ICON" aria-hidden="true"></i></div>',
  };
  
  panels_trida = {
      'main': '<div id="UID" class="CLASS" title="TITLE">HTML</div>',
      'icon': '<div id="UID" class="CLASS" title="TITLE" data-usd-id="DATAID" data-usd-exe="DATEXE"><i class="ICON" aria-hidden="true"></i></div>',
    };
  
  
  
  
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
    for(item in toolbar){
      code = ((item == 'main') ? panels.main : panels.icon);
      code = code.replace(/UID/g, toolbar[item].id);
      code = code.replace(/ICON/g, toolbar[item].icon);
      code = code.replace(/TITLE/g, toolbar[item].title);
      code = code.replace(/CLASS/g, toolbar[item].class);
      code = code.replace(/DATAID/g, toolbar[item].dataid);
      code = code.replace(/DATEXE/g, toolbar[item].dataact);
      if(item == 'main'){
        panel = code;
      }
      else{
        codes = codes + "&nbsp;\n" + code;
      }
    }
    var html = panel.replace(/HTML/g, codes + "\n");
    html = html.replace(/UID/g, id)
    //if(DEBUG) ; console.log(html);
    if(DEBUG)  console.log('buildPanelsUkol done.');
    return html;
  }
  

  function buildPanelsTrida(toolbar, panels, id){
    var panel = '';
    var src = '';
    var codes = '';
    for(item in toolbar){
      src = ((item == 'main') ? panels.main : panels.icon);
      src = src.replace(/UID/g, toolbar[item].id);
      src = src.replace(/ICON/g, toolbar[item].icon);
      src = src.replace(/TITLE/g, toolbar[item].title);
      src = src.replace(/CLASS/g, toolbar[item].class);
      src = src.replace(/DATAID/g, toolbar[item].dataid);
      src = src.replace(/DATEXE/g, toolbar[item].dataact);
      if(item == 'main'){
        panel = src;
      }
      else{
        codes = codes + "&nbsp;\n" + src;
      }
    }
    var html = panel.replace(/HTML/g, codes);
    html = html.replace(/UID/g, id)
    //if(DEBUG)  console.log(html);
    return html;
  }
  
  function removeTridy(tridy, keep){
    var cnt = 0;
    for(trida in tridy){
      var index = keep.indexOf(trida);
      if(index == -1){
        $('#heading' + trida).parent().remove();
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
   * @param array tridy IDs
   * @param array favs IDs
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
   * @param array ukoly IDs
   * @param array favs IDs
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
      $('#usd_pin_' + ukol_id).on( "click", function() {
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
    case 'pin':
      var index = pref_ukoly_pin.indexOf(uid);
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
              if (index == -1) {
                pref_ukoly_done.push(ukol_id);
              }
              localStorage.setItem('pref_ukoly_done', JSON.stringify(pref_ukoly_done));
              break;
            case 'rem':
              var index = pref_ukoly_done.indexOf(ukol_id);
              console.log(index);
              if (index > -1) {
                pref_ukoly_done.splice(index, 1);
              }
              localStorage.setItem('pref_ukoly_done', JSON.stringify(pref_ukoly_done));
              break;
          }
          console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;
          
        case 'pin':
          $('#usd_pin_'+ ukol_id).toggleClass('usd_darkred');
          $('#novContent_'+ ukol_id).toggleClass('bg-danger');
          $('#novContent_'+ ukol_id).parent().toggleClass('panel-danger');
          $('#novContent_'+ ukol_id).toggleClass('aler-info');
          switch(action){
            case 'add': 
              var index = pref_ukoly_pin.indexOf(ukol_id);
              if (index == -1) {
                pref_ukoly_pin.push(ukol_id);
              }
              localStorage.setItem('pref_ukoly_pin', JSON.stringify(pref_ukoly_pin));
            break;
            case 'rem':
              var index = pref_ukoly_pin.indexOf(ukol_id);
              console.log(index);
              if (index > -1) {
                pref_ukoly_pin.splice(index, 1);
              }
              localStorage.setItem('pref_ukoly_pin', JSON.stringify(pref_ukoly_pin));
            break;
          }
          console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;
          
        case 'del':
          $('#novContent_'+ ukol_id).parent().fadeOut(100).fadeIn(100).fadeOut(100);
          switch(action){
            case 'add': 
              var index = pref_ukoly_del.indexOf(ukol_id);
              if (index == -1) {
                pref_ukoly_del.push(ukol_id);
              }
              localStorage.setItem('pref_ukoly_del', JSON.stringify(pref_ukoly_del));
            break;
            case 'rem':
              var index = pref_ukoly_del.indexOf(ukol_id);
              console.log(index);
              if (index > -1) {
                pref_ukoly_del.splice(index, 1);
              }
              localStorage.setItem('pref_ukoly_del', JSON.stringify(pref_ukoly_del));
            break;
          }
          console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;
          
        case 'hide':
          $('#usd_hide_'+ ukol_id).toggleClass('usd_darkred');
          $('#novContent_'+ ukol_id).toggleClass('usd_hide');
          $('#novContent_'+ ukol_id).siblings('.panel-footer').toggleClass('usd_hide');
          $('#novContent_'+ ukol_id).next().next().toggleClass('usd_hide');
          switch(action){
          case 'add': 
            var index = pref_ukoly_hide.indexOf(ukol_id);
            if (index == -1) {
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
          console.log('updateUkolyAction done. kind='+kind+' action='+action);
          break;
        case 'done':break;
      }
    }
  }
  
  /**
   * Toggle classes and add/remove from storage
   * @param array IDs
   * @param string action
   */
  function updateTridyStared(tridy, action){
    if(DEBUG)  console.log('updateTridyStared: tridy='+tridy+' action='+action);
    for(i = 0; i<tridy.length; i++){
      $('#usd_star_'+ tridy[i]).toggleClass('usd_darkred');
      $('#heading'+ tridy[i]).parent().toggleClass('panel-primary');
      //$('#heading'+ tridy[i]).toggleClass('usd_bg_darkpink');
      //$('#collapse'+ tridy[i]).toggleClass('usd_bg_pink');
      $('#collapse'+ tridy[i]).collapse('show');
      if(DEBUG)  console.log('updateTridyStared: tridy='+tridy+' action='+action+' tridy[i]='+tridy[i]);
      switch(action){
        case 'undefined': break;
        case 'add':
          var index = pref_tridy_fav.indexOf(tridy[i]);
          if (index == -1) {
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
          break;
        }
    }
    if(DEBUG)  console.log('Updated Tridy stars.');
  }
  
  /**
   * 
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
  
  
  function dummy(){
    console.log(  );
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
  updateUkolyAction(pref_ukoly_pin, 'pin', 'add');
  updateUkolyAction(pref_ukoly_del, 'del', 'add');
  updateUkolyAction(pref_ukoly_hide, 'hide', 'add');
  
  
});
