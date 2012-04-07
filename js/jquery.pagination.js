/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * This plugin needs at least jQuery 1.4.2
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 2.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
(function($){
    /**
	 * @class Class for calculating pagination values
	 */
    $.PaginationCalculator = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
    }

    $.extend($.PaginationCalculator.prototype, {
        /**
		 * Calculate the maximum number of pages
		 * @method
		 * @returns {Number}
		 */
        numPages:function() {
            return Math.ceil(this.maxentries/this.opts.items_per_page);
        },
        /**
		 * Calculate start and end point of pagination links depending on
		 * current_page and num_display_entries.
		 * @returns {Array}
		 */
        getInterval:function(current_page)  {
            var ne_half = Math.floor(this.opts.num_display_entries/2);
            var np = this.numPages();
            var upper_limit = np - this.opts.num_display_entries;
            var start = current_page > ne_half ? Math.max( Math.min(current_page - ne_half, upper_limit), 0 ) : 0;
            var end = current_page > ne_half?Math.min(current_page+ne_half + (this.opts.num_display_entries % 2), np):Math.min(this.opts.num_display_entries, np);
            return {
                start:start,
                end:end
            };
        }
    });

    // Initialize jQuery object container for pagination renderers
    $.PaginationRenderers = {}

    /**
	 * @class Default renderer for rendering pagination links
	 */
    $.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
        this.pc = new $.PaginationCalculator(maxentries, opts);
    }
    $.extend($.PaginationRenderers.defaultRenderer.prototype, {
        /**
		 * Helper function for generating a single link (or a span tag if it's the current page)
		 * @param {Number} page_id The page id for the new item
		 * @param {Number} current_page
		 * @param {Object} appendopts Options for the new item: text and classes
		 * @returns {jQuery} jQuery object containing the link
		 */
        createLink:function(page_id, current_page, appendopts){
            var lnk, np = this.pc.numPages();
            page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
            appendopts = $.extend({
                text:page_id+1,
                classes:""
            }, appendopts||{});
            if(page_id == current_page){
                // current => menu.class
                lnk = $("<span class=" + $('#menu').attr('class') + ">" + appendopts.text + "</span>");
            }
            else
            {
                lnk = $("<a>" + appendopts.text + "</a>")
                .attr('href', this.opts.link_to.replace(/__id__/,page_id));
            }
            if(appendopts.classes){
                lnk.addClass(appendopts.classes);
            }
            lnk.data('page_id', page_id);
            return lnk;
        },
        // Generate a range of numeric links
        appendRange:function(container, current_page, start, end, opts) {
            var i;
            for(i=start; i<end; i++) {
                this.createLink(i, current_page, opts).appendTo(container);
            }
        },
        getLinks:function(current_page, eventHandler) {
            var begin, end,
            interval = this.pc.getInterval(current_page),
            np = this.pc.numPages(),
            fragment = $("<div class='pagination'></div>");

            // Generate "Previous"-Link
            if(this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)){
                fragment.append(this.createLink(current_page-1, current_page, {
                    text:this.opts.prev_text,
                    classes:"prev"
                }));
            }
            // Generate starting points
            if (interval.start > 0 && this.opts.num_edge_entries > 0)
            {
                end = Math.min(this.opts.num_edge_entries, interval.start);
                this.appendRange(fragment, current_page, 0, end, {
                    classes:'sp'
                });
                if(this.opts.num_edge_entries < interval.start && this.opts.ellipse_text)
                {
                    $("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
                }
            }
            // Generate interval links
            this.appendRange(fragment, current_page, interval.start, interval.end);
            // Generate ending points
            if (interval.end < np && this.opts.num_edge_entries > 0)
            {
                if(np-this.opts.num_edge_entries > interval.end && this.opts.ellipse_text)
                {
                    $("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
                }
                begin = Math.max(np-this.opts.num_edge_entries, interval.end);
                this.appendRange(fragment, current_page, begin, np, {
                    classes:'ep'
                });

            }
            // Generate "Next"-Link
            if(this.opts.next_text && (current_page < np-1 || this.opts.next_show_always)){
                fragment.append(this.createLink(current_page+1, current_page, {
                    text:this.opts.next_text,
                    classes:"next"
                }));
            }
            $('a', fragment).click(eventHandler);
            return fragment;
        }
    });

    // Extend jQuery
    $.fn.pagination = function(data, opts){
        var mainData = data;
        maxentries = data.length;
        // Initialize options with default values
        opts = $.extend({
            items_per_page:10,
            num_display_entries:5,
            current_page:0,
            num_edge_entries:1,
            link_to:"#",
            prev_text:"Prev",
            next_text:"Next",
            ellipse_text:"...",
            prev_show_always:true,
            next_show_always:true,
            renderer:"defaultRenderer",
            show_if_single_page:false,
            load_first_page:true,
            callback:pageselectCallback,
            data_container: "#todo-wrapper"
        },opts||{});

        var containers = this,
        renderer, links, current_page;

        /**
		 * This is the event handling function for the pagination links.
		 * @param {int} page_id The new page number
		 */
        function paginationClickHandler(evt){
            var links,
            new_current_page = $(evt.target).data('page_id'),
            continuePropagation = selectPage(new_current_page);
            if (!continuePropagation) {
                evt.stopPropagation();
            }
            return continuePropagation;
        }

        /**
		 * This is a utility function for the internal event handlers.
		 * It sets the new current page on the pagination container objects,
		 * generates a new HTMl fragment for the pagination links and calls
		 * the callback function.
		 */
        function selectPage(new_current_page) {
            // update the link display of a all containers
            containers.data('current_page', new_current_page);
            links = renderer.getLinks(new_current_page, paginationClickHandler);
            containers.empty();
            links.appendTo(containers);
            // call the callback and propagate the event if it does not return false
            var continuePropagation = opts.callback(new_current_page,mainData,opts, containers);
            return continuePropagation;
        }

        // -----------------------------------
        // Initialize containers
        // -----------------------------------
        current_page = parseInt(opts.current_page);
        containers.data('current_page', current_page);
        // Create a sane value for maxentries and items_per_page
        maxentries = (!maxentries || maxentries < 0)?1:maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;

        if(!$.PaginationRenderers[opts.renderer])
        {
            throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
        }
        renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);

        // Attach control events to the DOM elements
        var pc = new $.PaginationCalculator(maxentries, opts);
        var np = pc.numPages();
        containers.bind('setPage', {
            numPages:np
        }, function(evt, page_id) {
            if(page_id >= 0 && page_id < evt.data.numPages) {
                selectPage(page_id);
                return false;
            }
        });
        containers.bind('prevPage', function(evt){
            var current_page = $(this).data('current_page');
            if (current_page > 0) {
                selectPage(current_page - 1);
            }
            return false;
        });
        containers.bind('nextPage', {
            numPages:np
        }, function(evt){
            var current_page = $(this).data('current_page');
            if(current_page < evt.data.numPages - 1) {
                selectPage(current_page + 1);
            }
            return false;
        });

        // When all initialisation is done, draw the links
        links = renderer.getLinks(current_page, paginationClickHandler);
        containers.empty();
        if(np > 1 || opts.show_if_single_page) {
            links.appendTo(containers);
        }
        // call callback function
        if(opts.load_first_page) {
            opts.callback(current_page,mainData,opts, containers);
        }
    } // End of $.fn.pagination block

})(jQuery);

// Added by Dmitri Maksimov
// for use only in Kasutajaliidesed project.
// (04.03.12)
/**
* Callback function that displays the content.
*
* Gets called every time the user clicks on a pagination link.
*
* @param {int}page_index New Page index
* @param {jQuery} jq the container with the pagination links as a jQuery object
*/
function pageselectCallback(page_index, todosJSON,opt, jq){
    // Get number of elements per pagionation page from options
    var items_per_page = opt.items_per_page;
    var max_elem = Math.min((page_index+1) * items_per_page, todosJSON.length);
    var newcontent = '';

    // Iterate through a selection of the content and build an HTML string
    for(var i=page_index*items_per_page;i<max_elem;i++)
    {
        // old template
//        newcontent += '<div class="todo fineBox">';
//
//        newcontent += '<h3 class="todo-heading">' + todosJSON[i].name + '</h3>';
//        newcontent += '<p><input type="checkbox" name="todo-urgent" '+todosJSON[i].isUrgent+'>urgent</input>';
//        newcontent += '<input type="checkbox" name="todo-important" '+todosJSON[i].isImportant+'>important</input></p>';
//        newcontent += '<p>Deadline: '+todosJSON[i].deadline+'</p>';
//        newcontent += '<p>Description: '+todosJSON[i].description+'</p>';
//        newcontent += '<p>State: '+todosJSON[i].state+'</p>';
//        newcontent += '<p>Tags: '+todosJSON[i].tags+'</p>';
//        newcontent += '<p><input type="checkbox" name="todo-active" '+todosJSON[i].isActive+'>Active</input></p>';
//
//        newcontent += '</div>';
        disabledClass = '';
        if (todosJSON[i].isActive == '') {
            disabledClass = "disabled";
        }
        newcontent += '<table class="todo-instance '+disabledClass+'"> \
            <tr>\
                <td rowspan="3" class="todo-active-checkbox"><input type="checkbox" name="active" value="ON" '+todosJSON[i].isActive+' /></td>\
            <td colspan="3" class="todo-name">' + todosJSON[i].name + '</td>\
            </tr>\
            <tr>\
                <td colspan="3" class="todo-tags">'+todosJSON[i].tags+'</td>\
            </tr>\
            <tr>\
                <td class="todo-date">'+todosJSON[i].deadline+'</td>\
                <td class="todo-list">\
                    <ul>\
                        <li><input type="checkbox" disabled="disabled" name="urgent" value="ON" '+todosJSON[i].isUrgent+' /> urgent</li>\
                        <li><input type="checkbox" disabled="disabled" name="important" value="ON" '+todosJSON[i].isImportant+' /> important</li>\
                    </ul>\
                </td>\
                <td class="todo-state">'+todosJSON[i].state+'</td>\
            </tr>\
            <tr>\
                <td colspan="4" class="todo-description">'+todosJSON[i].description+'</td>\
            </tr>\
        </table>';
    }
    //
    // Replace old content with new content
    $(opt.data_container).html(newcontent);
    //
    // Prevent click eventpropagation
    return false;
}