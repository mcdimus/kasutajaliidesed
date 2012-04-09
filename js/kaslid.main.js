var todosJSON = [
{
    "created":"1333999071096",
    "name":"TODO #1",
    "deadline":"12:00 13.04.2012",
    "description":"My fisrt todo. Hell yeah!",
    "isUrgent":true,
    "isImportant":false,
    "isActive":true,
    "state":"Pending",
    "tags":"work meeting"
},
{
    "created":"1333999071097",
    "name":"TODO #2",
    "deadline":"12:00 13.04.2012",
    "description":"My second todo. Hell yeah!",
    "isUrgent":false,
    "isImportant":true,
    "isActive":true,
    "state":"Pending",
    "tags":"work meeting"
},
{
    "created":"1333999071098",
    "name":"TODO #3",
    "deadline":"12:00 13.04.2012",
    "description":"My third todo. Hell yeah!",
    "isUrgent":true,
    "isImportant":false,
    "isActive":true,
    "state":"Pending",
    "tags":"work meeting"
},
{
    "created":"1333999071099",
    "name":"TODO #4",
    "deadline":"12:00 13.04.2012",
    "description":"My fourth todo. Hell yeah!",
    "isUrgent":true,
    "isImportant":true,
    "isActive":true,
    "state":"Pending",
    "tags":"work meeting"
},
{
    "created":"1333999071100",
    "name":"TODO #5",
    "deadline":"12:00 13.04.2012",
    "description":"My fifth todo. Hell yeah!",
    "isUrgent":true,
    "isImportant":false,
    "isActive":true,
    "state":"Pending",
    "tags":"work meeting"
}
];

$(document).ready(function() {

    //=================================================//
    //-------------- Search feature -------------------//
    //=================================================//

    // Simple search
    function simpleSearch() {
        options.dataprocessing.filter = true;
        options.dataprocessing.filterCriteria = $('input#search-keyword').val();
        displayTodos();
    }

    // Hides advanced search form
    function hideAdvancedSearch() {
        $advancedSearchShow.attr('data-show','false');
        $overlay.css('visibility','hidden');
        $advancedSearchForm.hide();
    }

    // Shows / hides advanced search form
    var $advancedSearchForm = $('div#advanced-search-form'),
    $advancedSearchShow = $('button#advanced-search-show');
    $advancedSearchShow.on('click', function() {
        if ($advancedSearchShow.attr('data-show') == 'false') {
            hideSettings();
            hideNewTodoForm();
            $advancedSearchForm.show();
            $advancedSearchShow.attr('data-show','true');
            showOverlay();
        } else {
            hideAdvancedSearch();
        }
    });

    $('#cancel-advanced-search').on('click', function() {
        hideAdvancedSearch();
    });

    // Button listener for search
    $('#search').on('click', simpleSearch);

    // 'Enter' key listener for search
    $("#search-keyword").keypress(function(event) {
        if (event.which == 13) {
            simpleSearch();
        }
    });

    // Clear search results
    $('#clear-search').on('click', function() {
        options.dataprocessing.filter = false;
        $('input#search-keyword').val('');
        displayTodos();
    });

    //=================================================//
    //-------------- Utils ----------------------------//
    //=================================================//

    // Shows overlay (shade on the page when showing popup windows)
    var $overlay =  $('div#overlay');
    function showOverlay() {
        $overlay.css('visibility','visible');
        $overlay.css('height', $('html').css('height'));
    }
    // Exit by submitting exit form
    $('#sign-out').on('click', function() {
        $('#signout-form').submit();
    });

    //=================================================//
    //-------------- New Todo Form --------------------//
    //=================================================//

    // Hides new todo addenum form;
    var $newTodoForm = $('div#new-todo'),
    $newTodoShow = $('#new-todo-show');
    function hideNewTodoForm() {
        $overlay.css('visibility','hidden');
        $newTodoForm.hide();
        $newTodoShow.attr('data-show', 'false');
        clearTags();
    }

    // Adds / removes tags to new todo
    $('div#todo-for-tags').on('click', 'span', function() {
        $clickedSpan = $(this);
        if($clickedSpan.attr('data-clicked') == 'false') {
            $clickedSpan.attr('data-clicked', 'true')
            .addClass($('#menu').attr('class'))
            .addClass('clicked')
            .clone().attr('id', 'todo-tag-' + $clickedSpan.text())
            .appendTo($('div#todo-for-tags-hidden'));
        } else {
            $clickedSpan.attr('data-clicked', 'false')
            .removeClass();
            $('span#todo-tag-' + $clickedSpan.text()).remove();
        }
    });

    // Shows / hides new todo addenum form
    $newTodoShow.on('click', function() {
        if ($newTodoShow.attr('data-show') == 'false') {
            $newTodoForm.show();
            hideSettings();
            hideAdvancedSearch();
            showOverlay();
            $newTodoShow.attr('data-show', 'true');
        } else {
            hideNewTodoForm();
        }
    });

    $('#cancel-todo').on('click', function() {
        hideNewTodoForm();
    });

    //=================================================//
    //-------------- Settings -------------------------//
    //=================================================//

    // Hides settings form
    var $settings = $('#settings'),
    $settingsShow = $('#settings-show');
    function hideSettings() {
        $overlay.css('visibility','hidden');
        $settingsShow.attr('data-show', 'false');
        $settings.hide();
    }

    // Show / hide settings form
    $settingsShow.on('click', function() {
        if($settingsShow.attr('data-show') == 'false') {
            $settings.show();
            hideNewTodoForm();
            hideAdvancedSearch();
            showOverlay();
            $settingsShow.attr('data-show', 'true');
        } else {
            hideSettings();
        }
    });

    $('#cancel-settings').on('click', function() {
        hideSettings();
    });

    //=================================================//
    //-------------- Otptions -------------------------//
    //=================================================//

    // init options
    var options = {
        pagination : {
            items_per_page: $('select#showOnPage').val(),
            data_container: "#todo-wrapper"
        },
        dataprocessing : {
            sort: false,
            filter: false
        }
    };

    // change options
    $('div#todo-display-settings').on('change', 'select', function() {
        id = $(this).attr('id');
        switch (id) {
            case 'sortDir' :
                options.dataprocessing.sort = true;
                options.dataprocessing.sortDir = $(this).val();
                break;
            case 'sortBy' :
                options.dataprocessing.sort = true;
                options.dataprocessing.sortBy = $(this).val();
                break;
            case 'showOnPage' :
                options.pagination.items_per_page = $(this).val();
                break;
        }
        displayTodos();
    });

    // Adds new todo
    $('#addTodo').on('click', function() {

        var todo = {};
        todo.created = $.now();
        todo.isUrgent = $('input#urgent').attr('checked') ? true : false;
        todo.isImportant = $('input#important').attr('checked') ? true : false;
        todo.name = $('input#name').val();
        todo.deadline = $('input#deadline').val();
        todo.description = $('textarea#description').val();
        todo.state = $('select#state').val();
        todo.isActive = true;
        todo.tags = '';
        $('div#todo-for-tags-hidden span').each(function() {
            todo.tags += $(this).html() + ' ';
        });
        hideNewTodoForm();
        clearTags();
        todosJSON.unshift(todo); //adds new items to the beginning of an array
        displayTodos();
    });


    function displayTodos() {
        processedTodosJSON = $.processData(todosJSON, options.dataprocessing);
        // Create pagination element with options from var
        $("div.for-pagination").pagination(processedTodosJSON, options.pagination);
    }
    displayTodos();

    // PIECE OF SHIT
    $('input[name=active]').on('change', function() {
        name =$(this).parents('table').toggleClass('disabled')
        .find('td.todo-name').html();

        $.each(todosJSON, function(index,value) {
            if (value.name === name) {
                value.isActive = '';
            }
        });
    });
});