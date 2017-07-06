/*
 * 
Name: Skip
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2015 03
Revision: Looma 2.0.0



filename: looma-activities.js
Description:
 */

'use strict';

function makeActivityButton (id, appendToDiv) {
    // given an ID for an activity in the activities collection in mongo,
    // attach a button [clickable button that launches that activity] to "appendToDiv"

    //post to looma-database-utilities.php with cmd='openByID' and id=id
    // and result function makes a DIV and calls "succeed(div)"
             $.post("looma-database-utilities.php",
                {cmd: 'openByID', collection: 'activities', id: id},
                function(result) {
                        var fp = (result.fp) ? 'data-fp=\"' + result.fp + '\"' : null;
                        var $newButton = $(
                                '<button class="activity play img" ' +
                                'data-fn="' + result.fn + '" ' +
                                fp +
                                'data-ft="' + result.ft + '" ' +
                                'data-dn="' + result.dn + '" >'
                           );

                        $newButton.append($('<img src="' + LOOMA.thumbnail(result.fn, result.fp, result.ft) + '">'));
                        $newButton.append($('<span>').text(result.dn));
                        $newButton.click(function() {LOOMA.playMedia(this);});
                        $newButton.appendTo(appendToDiv);

                        //need to attach clickhandler (LOOMA.playMedia)
                    },
                'json'
              );
        }; //end makeActivityButton()

function displayFileSearchResults(results) 
{
    var $display = $('#search-results').empty().append('<p style="margin-bottom: 0;">Search Results:</p>');

    if (results.length == 0) {$display.append("<p>No Results</p>").show();}
    
    else {
        var buttons = 1, maxButtons = 3;

        $display.append('<table id="results-table"></table>');
        
        $.each(results, function(index, value) {
            $('#results-table').append("<tr><td id='query-result'><td></tr>");
            makeActivityButton(value['_id']['$id'], '#query-result');
            $display.show();
            buttons++; 
            //if (buttons > maxButtons) {buttons = 1; echo "<tr></tr>";};
           });
        
    };
}; //end displayFileSearchResults()

function playActivity(event) {
    var button = event.currentTarget;

    //event.target may be the contained IMG or SPAN, not the BUTTON,
    //so use event.currentTarget which is always the element that the event is attached to,
    //even if a containing element gets the click

    // could instead catch the event in BUTTON during capture phase and 
    // do event.endPropagation() to keep it from propogating
    //
    // something like $("button.play").on('click', playActivity, true);
    // and, event.stopPropogation(); in the playActivity() function

    //OLD CODE: in case click event has IMG or SPAN contained in the BUTTON, get the BUTTON element
    //if (button.nodeName != 'BUTTON') button = button.parentNode;
    LOOMA.setStore('scroll', $("#main-container-horizontal").scrollTop(), 'session');
    console.log($("#main-container-horizontal").scrollTop());
    LOOMA.playMedia(button);
};


var scrollTimeout = null;
var scrollDebounce = 5000; //msec delay to debounce scroll stop

$(document).ready (function() {
    $('#search-form').submit(function( event ) {
                  $('#search-results').show();
                  event.preventDefault();
                  $.post( "looma-database-utilities.php",
                           $( "#search-form" ).serialize(),
                           function (result) {displayFileSearchResults(result);return;},
                           'json');
    });

    $("#toggle-database").click(function(){$('#dir-table').toggle();});//'fade', {}, 1000

    $("button.play").click(playActivity);

    $("button.zeroScroll").click(function() {LOOMA.setStore('scroll', 0, 'local');});
    $("#main-container-horizontal").scrollTop(LOOMA.readStore('scroll', 'session'));

});

