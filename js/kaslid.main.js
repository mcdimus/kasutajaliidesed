var todosJSON = [
{
    "name":"TODO #1",
    "deadline":"12:00 13.04.2012",
    "description":"My fisrt todo. Hell yeah!",
    "isUrgent":'checked="checked"',
    "isImportant":false,
    "isActive":'checked="checked"',
    "state":"Pending",
    "tags":"bla bla bla"
},
{
    "name":"TODO #2",
    "deadline":"12:00 13.04.2012",
    "description":"My second todo. Hell yeah!",
    "isUrgent":true,
    "isImportant":'checked="checked"',
    "isActive":'checked="checked"',
    "state":"Pending",
    "tags":"bla bla bla"
},
{
    "name":"TODO #3",
    "deadline":"12:00 13.04.2012",
    "description":"My third todo. Hell yeah!",
    "isUrgent":'checked="checked"',
    "isImportant":false,
    "isActive":'checked="checked"',
    "state":"Pending",
    "tags":"bla bla bla"
},
{
    "name":"TODO #4",
    "deadline":"12:00 13.04.2012",
    "description":"My fourth todo. Hell yeah!",
    "isUrgent":'checked="checked"',
    "isImportant":'checked="checked"',
    "isActive":'checked="checked"',
    "state":"Pending",
    "tags":"bla bla bla"
},
{
    "name":"TODO #5",
    "deadline":"12:00 13.04.2012",
    "description":"My fifth todo. Hell yeah!",
    "isUrgent":'checked="checked"',
    "isImportant":false,
    "isActive":'checked="checked"',
    "state":"Pending",
    "tags":"bla bla bla"
}
];

$(document).ready(function() {

    /**************************************************
     * Search feature
     **************************************************/

    // Simple search
    function simpleSearch() {
        options.dataprocessing.filter = true;
        options.dataprocessing.filterCriteria = $('input#search-keyword').val();
        displayTodos();
    }
    // Shows / hides advanced search form
    var $advancedSearchDiv = $('div#advanced-search-div'),
    $advancedSearchShow = $('button#advanced-search-show');
    $advancedSearchShow.on('click', function() {
        $advancedSearchDiv.toggle();
        if ($advancedSearchShow.text() == "Advanced search") {
            $advancedSearchShow.text('Cancel');
        } else {
            $advancedSearchShow.text('Advanced search');
        }
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

    // Exit by submitting exit form
    $('#sign-out').on('click', function() {
        $('#signout-form').submit();
    });

    var $overlay =  $('div#overlay');
    function showOverlay() {
        $overlay.css('visibility','visible');
        $overlay.css('height', $('html').css('height'));
    }

    // Hides new todo addenum form;
    var $newTodoForm = $('div#new-todo'),
    $newTodoShow = $('#new-todo-show');
    function hideNewTodoForm() {
        $overlay.css('visibility','hidden');
        $newTodoShow.text('Add TODO');
        clearTags();
        $newTodoForm.hide();
    }

    // Hides settings form
    var $settings = $('#settings'),
    $settingsShow = $('#settings-show');
    function hideSettings() {
        $settingsShow.text('Settings');
        $overlay.css('visibility','hidden');
        $settings.hide();
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
        $newTodoForm.toggle();
        if ($newTodoShow.text() == "Add TODO") {
            hideSettings();
            showOverlay();
            $newTodoShow.text('Cancel');
        } else {
            hideNewTodoForm();
        }
    });

    // Show / hide settings form
    $settingsShow.on('click', function() {
        $settings.toggle();
        if($settingsShow.text() == "Settings") {
            hideNewTodoForm();
            $settingsShow.text('Close');
            showOverlay();
        } else {
            hideSettings();
        }
    });

    // Adds new todo
    $('#addTodo').on('click', function() {

        var todo = {};

        todo.isUrgent = $('input#urgent').attr('checked') ? 'checked="checked"' : '';
        todo.isImportant = $('input#important').attr('checked') ? 'checked="checked"' : '';
        todo.name = $('input#name').val();
        todo.deadline = $('input#deadline').val();
        todo.description = $('textarea#description').val();
        todo.state = $('select#state').val();
        todo.isActive = 'checked="checked"';
        todo.tags = '';
        $('div#todo-for-tags-hidden span').each(function() {
            todo.tags += $(this).html() + ' ';
        });
        hideNewTodoForm();
        clearTags();
        todosJSON.unshift(todo); //adds new items to the beginning of an array
        displayTodos();
    });

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

    function displayTodos() {
        processedTodosJSON = $.processData(todosJSON, options.dataprocessing);
        // Create pagination element with options from var
        $("div.for-pagination").pagination(processedTodosJSON, options.pagination);
    }
    displayTodos();

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