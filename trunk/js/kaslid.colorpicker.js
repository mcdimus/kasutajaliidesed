/*
 * The project code connected to colorpicker feature.
 */

$(document).ready(function() {
    // Changes color theme
    $('#colortheme-picker').on('change', function() {
        $('.pagination span').removeClass($('#menu').attr('class')).
        addClass($(this).val());
        $('body').removeClass().addClass('body-' + $(this).val());
        $('#menu').removeClass().addClass($(this).val());
        $('button').removeClass().addClass($(this).val());
        $('div#new-todo').css('border-color', $('#menu').css('border-left-color'));
    });
});