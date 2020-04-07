/**
 * This is my very first extension for FireFox :)
 * What it does:
 * - add checkboxes to all headers and bodies of accordeon 
 * - toggle color of the selected heades and bodies of accordeon 
 * - keep the settigns in locale storage
 * @author Jindrich Pachta
 * @version 1.0
 * @history 2020-04-07
 */

$(document).ready(function() {
  
  // We are in testing
  //document.body.style.border = "15px solid red";
  //console.log("ucimesedoma.maskola.cz");
  
  
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
  var pref_ukoly = JSON.parse(localStorage.getItem("pref_ukoly"));
  if(pref_ukoly == null){
    pref_ukoly = [];
  }
  var pref_tridy = JSON.parse(localStorage.getItem("pref_tridy"));
  if(pref_tridy == null){
    pref_tridy = [];
  }
  var pref_barvy = JSON.parse(localStorage.getItem("pref_barvy"));
  if(pref_barvy == null){
    var pref_barvy = {
        trida_header: '#f5f5f5',
        trida_header_new: 'pink',
        trida_body: 'white',
        trida_body_new: 'pink',
        task_body: 'white',
        task_body_hotovo: '#dff0d8',
          };
    localStorage.setItem('pref_barvy', JSON.stringify(pref_barvy));
  }
  
  
  
  /// 
  /// Ukoly checkboxy
  /// 
  var checkbox = "<div id='ukol_UID' style='background-color: transparent; padding-left: 5px;'><input id='checkbox_UID' type='checkbox' style='cursor: pointer;'></checbox><label for='checkbox_UID' style='padding-left: 5px; cursor: pointer;'>Máme vypracováno</label></div>";
  
  // loop all tasks
  $("div[id^='novContent_']").each(
    function(i, el){
      id_long = $(el).attr("id");
      ukol_id = id_long.replace('novContent_','');
      checkbox_html = checkbox.replace(/UID/g, ukol_id);
      novContent_html = $('#novContent_' + ukol_id).html();
      checkbox_div = $(checkbox_html + novContent_html);
      $('#novContent_' + ukol_id).html(checkbox_div);
      $( "#checkbox_" + ukol_id ).on( "click", function() {
        switch($(this).is(':checked')){
          case false:  // remove to list of done tasks
            $(this).parent().parent().css( "background-color", pref_barvy.task_body );
            myTask(ukol_id,'rem');
            break;
          case true:   // add to list of done tasks
            $(this).parent().parent().css( "background-color", pref_barvy.task_body_hotovo );
            myTask(ukol_id,'add');
            break;
        }
      });
      
      // click on found in storage
      if(pref_ukoly.indexOf('' + ukol_id) > -1){
        $( "#checkbox_" + ukol_id ).click();
      }
  });
  
  
  
  function myTask(id_num, action){
    switch(action){
      case 'add':
        index = pref_ukoly.indexOf(id_num);
        if (index == -1) {
          pref_ukoly.push(id_num);
        }
        localStorage.setItem('pref_ukoly', JSON.stringify(pref_ukoly));
        break;
      case 'rem':
        index = pref_ukoly.indexOf(id_num);
        if (index > -1) {
          pref_ukoly.splice(index, 1);
        }
        localStorage.setItem('pref_ukoly', JSON.stringify(pref_ukoly));
        break;
    }
  }
  
  ///
  /// Store class rooms
  ///
  var checkbox_head = "\n<div id='head_UID' style='background-color: transparent; padding-left: 5px; float:right; width: 2em; background-color: transparent; text-align:center;' title='Pamatovat třídu'><input id='head_checkbox_UID' type='checkbox' style='cursor: pointer;'></checbox><label for='head_checkbox_UID' style='padding-left: 5px; cursor: pointer;' title='Pamatovat třídu'> </label></div>\n";
  
  
  $("div[id^='heading']").each(
    function(i, el){
      var id_long = $(el).attr("id");
      var id_num = id_long.replace('heading','');
      var checkbox_html = checkbox_head.replace(/UID/g, id_num);
      var heading_html = $('#heading' + id_num).html();
      var checkbox_div = $(checkbox_html + heading_html);
      $('#heading' + id_num).html(checkbox_div);
      $( "#head_checkbox_" + id_num ).on( "click", function() {
        switch($(this).is(':checked')){
          case false:
            myClassroom(id_num,'rem');
            break;
          case true:
            myClassroom(id_num,'add');
            break;
        }
      });
      if(pref_tridy.indexOf('' + id_num) > -1){
        myClassroom(id_num, 'load');
      }
    }
  );
    
  function myClassroom(id_num, action){
    switch(action){
      case 'add':
        index = pref_tridy.indexOf(id_num);
        if (index == -1) {
          pref_tridy.push(id_num);
        }
        localStorage.setItem('pref_tridy', JSON.stringify(pref_tridy));
        $('div#heading' + id_num).parent().css('background-color', pref_barvy.trida_header_new);
        myClassroom(id_num, 'load');
        break;
      case 'rem':
        index = pref_tridy.indexOf(id_num);
        if (index > -1) {
          pref_tridy.splice(index, 1);
        }
        localStorage.setItem('pref_tridy', JSON.stringify(pref_tridy));
        $('div#heading' + id_num).parent().css('background-color', pref_barvy.trida_header);
        //$('div#heading' + id_num).parent().parent().css( "background-color", "#f5f5f5" );
        myClassroom(id_num, 'unload');
        break;
      case 'load':
        $('#head_checkbox_' + id_num ).parent().parent().css( "background-color", pref_barvy.trida_header_new );
        $('div#heading' + id_num).parent().css('background-color','pink');
        $('#heading'+ id_num ).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        $('#head_checkbox_' + id_num ).prop("checked", true);
        $('#heading'+ id_num +' h4 a').click();
        break;
      case 'unload':
        $('#head_checkbox_' + id_num ).parent().parent().css( "background-color", pref_barvy.trida_header );
        $('div#heading' + id_num).parent().css('background-color','snow');
        $('#heading'+ id_num ).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        break;
    }
  }

});

