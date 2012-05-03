/*
 * The project code connected to colorpicker feature.
 */

$(document).ready(function() {
    // Changes color theme
    $('#colortheme-picker').on('change', function() {
        var curTheme = $('#menu').attr('class');
        $('.pagination span').removeClass(curTheme).addClass($(this).val());
        $('body').removeClass().addClass('body-' + $(this).val());
        $('#menu').removeClass().addClass($(this).val());
        $('button').not('.todo-edit').removeClass(curTheme).addClass($(this).val());
        $('div#new-todo').css('border-color', $('#menu').css('border-left-color'));
        $('span#search-form').removeClass(curTheme).addClass($(this).val());
    });
});