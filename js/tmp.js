/**
 * FrepUI - Form Replacement UI
 *
 * Replace form elements with HTML for styling
 * Dependencies: jQuery 1.4+
 *
 */
(function ($) {
    FrepUI = {
        // init
        init: function() {
            this.frep_ui_select();
        },

        // select replace
        frep_ui_select: function() {
            this.frep_ui_select_build();
            this.frep_ui_select_focus();
            this.frep_ui_select_hover();
        },

        // select list
        frep_ui_select_build: function() {
            $('select').hide();
            $('select').each(function() {
                var first_child_text = $(this).children('select option:first').text();

                var value = $(this).children('select option:selected').text(),
                default_value = ( value ? value : first_child_text );
                // wrap select
                $(this).wrap('<div class="frep-ui-select-wrap" id="'+$(this).attr('name')+'" />');
                // add tabindex
                $(this).parent('div').attr('tabindex', $(this).attr('tabindex'));
                // create ul list wrap
                $(this).parent('div').prepend('<ul class="frep-ui-select-list" />');
                // create current value div
                $(this).parent('div').prepend('<div class="frep-ui-select-value"><span>' + default_value + '</span></div>');
                // build ul list
                $(this).parent('div').find('option').each( function(n, el) {
                    var selected = ( $(el).attr('selected') ) ? ' class="selected"' : '';
                    $(this).parent().prev('.frep-ui-select-list').append('<li'+selected+'><span>' + $(el).text() + '</span></li>');
                });
            });
        },

        // select focus event
        frep_ui_select_focus: function() {
            var save_count = false;
            $('.frep-ui-select-wrap').bind('focus', function(event) {
                var children = $(this).find('.frep-ui-select-list li').length-1,
                count = ( save_count != false ) ? save_count : -1;
                $(this).addClass('active');
                $(this).bind('keydown', function (e) {
                    var keyCode = e.keyCode || e.which;
                    // up or down only
                    if ( keyCode == 38 || keyCode == 40 ) {
                        if ( keyCode == 38 ) {
                            count--;
                        }
                        if ( keyCode == 40 ) {
                            count++;
                        }
                        // save count for future focus events
                        save_count = count;
                        // cycle through list with click event
                        if ( count <= children && count >= 0 ) {
                            $(this).find('.frep-ui-select-list li:eq('+count+')').click();
                        } else if ( count < 0 ) {
                            $(this).find('.frep-ui-select-list li:eq('+children+')').click();
                            count = children;
                        } else if ( count > children ) {
                            $(this).find('.frep-ui-select-list li:eq(0)').click();
                            count = 0;
                        }
                    }
                    e.preventDefault();
                });
            }).bind('blur', function() {
                $(this).removeClass('active');
                $(this).find('.frep-ui-select-list').hide();
            });
        },

        // select hover event
        frep_ui_select_hover: function() {
            $('.frep-ui-select-wrap').live({
                mouseover: function() {
                    $(this).addClass('active');
                    $(this).children('.frep-ui-select-list').show();
                },
                mouseout: function() {
                    $(this).children('.frep-ui-select-list').hide();
                    $(this).removeClass('active');
                }
            });
            // select list item
            $('.frep-ui-select-list li').live('click', function() {
                var value = $(this).text(),
                index = $(this).index();
                $(this).parent('.frep-ui-select-list').prev('.frep-ui-select-value').find('span').text(value);
                $(this).parent('.frep-ui-select-list').next().find('option:selected').removeAttr('selected');
                $(this).parent('.frep-ui-select-list').next().find('option:eq('+index+')').attr('selected', 'selected');
                $(this).parent('.frep-ui-select-list').next().change();
                $(this).parent('.frep-ui-select-list').hide();
                $(this).parent('.frep-ui-select-list').parent().removeClass('active').unbind('hover');
                $(this).parent('.frep-ui-select-list').find('.selected').removeClass('selected');
                $(this).addClass('selected');
            });
        }

    };

    // load replacements
    $(document).ready(function() {
        FrepUI.init();
    });

})(jQuery);

/**
 * Premium JS
 *
 */
(function($) {
    $(document).ready( function() {
//        /* Clone the login form */
//        $('.premium-amember-widget').clone().appendTo('#user-info');

        /* Log in click event */
        $('#user-info a.sign-in').live('click', function(event){
            $('#sendpassform').hide();
            $('#loginform').show();
            $(this).next('ul').toggleClass('show-login');
            $('input#amember_login').focus();
            event.preventDefault();
        });

        $(document).bind('click', function(e) {
            var $clicked = $(e.target);
            if (!$clicked.parent().hasClass('sign-in') && !$clicked.hasClass('sign-in') && !$clicked.hasClass('show-login') && !$clicked.parents().hasClass('show-login') ) {
                $('.show-login').removeClass('show-login');
            }
        });

        /* basic hover event */
        $('.basic-dropdown').live('hover', function(){
            $('.arrow', this).toggle();
            $('div', this).toggle();
        });

        /* bbPress fixes */
        $('.bbp-form div#password').remove();
        $('#bbp-your-profile .entry-title:eq(3)').hide();
        $('#bbp-your-profile .bbp-form:eq(3)').hide();
        $("#bbp_topic_subscription").parent().css({
            'float':'left',
            'padding-bottom':'0px'
        });
        $("#bbp_topic_subscription").next('label').css({
            'display':'inline'
        });

        $('a.forgot-pass-link').live('click', function(event){
            $('#loginform').hide();
            $('#sendpassform').show();
            $('input#login').focus();
            event.preventDefault();
        });

        $('a.log-in-link').live('click', function(event){
            $('#sendpassform').hide();
            $('#loginform').show();
            $('input#amember_login').focus();
            event.preventDefault();
        });

        $('a.bbpress-quote-link').live('click', function(event){
            var postid = $(this).attr('id').split("reply-id-")[1];
            $('#bbp_reply_content').focus().val( '[bbp_quote reply_id=' + postid + ']\n' + $('#bbp-reply-' + postid).html() + '[/bbp_quote]\n' );
            event.preventDefault();
        });

    });
})(jQuery);