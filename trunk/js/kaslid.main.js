var categoryJSON = [
"All",
"University",
"Relations",
"Work",
"Girlfriend"
];

var todosJSON = [
{
    "category":"University",
    "created":"1333999071096",
    "name":"TODO #1",
    "deadline":"12:00 13.04.2012",
    "description":"My first todo. Hell yeah!",
    "isUrgent":true,
    "isImportant":false,
    "isActive":true,
    "state":"Pending",
    "tags":"work meeting"
},
{
    "category":"University",
    "created":"1333999071097",
    "name":"TODO #2",
    "deadline":"12:00 13.04.2012",
    "description":"My second todo. Hell yeah!",
    "isUrgent":false,
    "isImportant":true,
    "isActive":true,
    "state":"In progress",
    "tags":"work meeting"
},
{
    "category":"Girlfriend",
    "created":"1333999071098",
    "name":"TODO #3",
    "deadline":"12:00 13.04.2012",
    "description":"My third todo. Hell yeah!",
    "isUrgent":true,
    "isImportant":false,
    "isActive":true,
    "state":"Completed",
    "tags":"work meeting"
},
{
    "category":"Girlfriend",
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
    "category":"Girlfriend",
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
            search: false,
            filter: {
                category: 'All'
            }
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

    //=================================================//
    //-------------- Categories -----------------------//
    //=================================================//

    function displayCategories() {

        var categoryList = $('div.category-container ul'),
        categoryContainer = $('select#category');
        var categoryOptions = $('select#search-category');
        categoryList.html('')
        categoryOptions.html('');
        $.each(categoryJSON, function(index, value) {

            var li = $('<li></li>').text(value),
            option = $('<option></option>').val(value).text(value);
            var option = $('<option></option>').attr('value', value).text(value);
            if (index == 0)
                li.addClass('selected');

            categoryList.append(li);
            categoryOptions.append(option);
        });
    };
    displayCategories();

    $('div.category-container').on('click', 'li', function() {
        $this = $(this);
        $this.
        siblings('li').
        removeClass('selected').
        end().
        addClass('selected');

        $('h2#current-category span').text($this.text());

        options.dataprocessing.filter.category = $this.text();
        displayTodos();
    });

    $('button#addcategory').on('click', function() {
        var newCategoryName = $('input#newcategory').val();
        categoryJSON.push(newCategoryName);
        displayCategories();
    });

    //=================================================//
    //-------------- Search feature -------------------//
    //=================================================//

    // Simple search
    function simpleSearch() {
        options.dataprocessing.search = true;
        options.dataprocessing.searchCriteria = $('input#search-keyword').val();
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
        options.dataprocessing.search = false;
        $('div.category-container ul li').first().trigger('click');
        $('input#search-keyword').val('');
        options.dataprocessing.filter = {category: 'All'};
        displayTodos();
    });

    $('button#advanced-search').on('click', function() {
        var opt = {};
        if ($('#search-name').val().length != 0) {
            opt.name = $('#search-name').val();
        }
        if ($('#search-description').val().length != 0) {
            opt.description = $('#search-description').val();
        }
        opt.isactive = ($('#search-isactive').attr('checked') == 'checked') ? true : false;
        opt.category = $('select#search-category').val();
        opt.state = ($('#search-state').val() != '') ? $('#search-state').val()  : false;
        opt.tags = $('#search-tags').val();

        options.dataprocessing.filter = opt;
        hideAdvancedSearch();
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

    $('input#deadline').datepicker();

    $( "input#search-date-from, input#search-date-to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onSelect: function( selectedDate ) {
            var option = this.id == "search-date-from" ? "minDate" : "maxDate",
            instance = $( this ).data( "datepicker" ),
            date = $.datepicker.parseDate(
                instance.settings.dateFormat ||
                $.datepicker._defaults.dateFormat,
                selectedDate, instance.settings );
            dates.not( this ).datepicker( "option", option, date );
        }
    });

    //=================================================//
    //-------------- New Todo Form --------------------//
    //=================================================//

    // Hides new todo addenum form;
    var $newTodoForm = $('div#new-todo'),
    $newTodoShow = $('#new-todo-show'),
    $addTodo = $('#addTodo'),
    $editTodo = $('#editTodo');
    function showNewTodoForm() {
        $newTodoForm.show();
        hideSettings();
        hideAdvancedSearch();
        showOverlay();
        $newTodoShow.attr('data-show', 'true');
    }

    function hideNewTodoForm() {
        $overlay.css('visibility','hidden');
        $newTodoForm.hide();
        $newTodoShow.attr('data-show', 'false');
        $addTodo.css('display', 'inline-block');
        $editTodo.css('display', 'none');
        $newTodoForm.find('h3').text('New TODO');
        $newTodoForm.find('input').val('').end()
        .find('textarea').text('');
        $('#urgent').removeAttr('checked');
        $('#important').removeAttr('checked');
        $('#category').val('All');
        $('#state').val('Undone');
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
            showNewTodoForm();
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
    //-------------- Add Todo -------------------------//
    //=================================================//

    // Adds new todo
    $addTodo.on('click', function() {

        var todo = {};
        todo.created = $.now();
        todo.isUrgent = $('input#urgent').attr('checked') ? true : false;
        todo.isImportant = $('input#important').attr('checked') ? true : false;
        todo.category = $('select#category').val();
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

    //=================================================//
    //-------------- Display Todos --------------------//
    //=================================================//

    function displayTodos() {
        console.log(options.dataprocessing);
        processedTodosJSON = $.processData(todosJSON, options.dataprocessing);
        // Create pagination element with options from var
        $("div.for-pagination").pagination(processedTodosJSON, options.pagination);
    }
    displayTodos();

    //=================================================//
    //-------------- Edit Todo ------------------------//
    //=================================================//
    var todoToEdit;
    $('div#todo-wrapper').on('click', 'button.todo-edit', function() {
        var todoTimestamp = $(this).siblings('input[type="hidden"]').val();
        // todoToEdit = $.grep(todosJSON, function(value, index) {
        //     return (value['created'].indexOf(todoTimestamp) != -1)
        // });
        $.each(todosJSON, function(index) {
            if (todosJSON[index].created === todoTimestamp) {
                todoToEdit = todosJSON[index];
            }
        });
        showNewTodoForm();
        $newTodoForm.find('h3').text('Edit TODO');
        $addTodo.css('display', 'none');
        $editTodo.css('display', 'inline-block');
        $('#urgent').attr('checked', todoToEdit.isUrgent);
        $('#important').attr('checked', todoToEdit.isImportant);
        $('#category').val(todoToEdit.category);
        $('#name').val(todoToEdit.name);
        $('#deadline').val(todoToEdit.deadline);
        $('#description').text(todoToEdit.description);
        $('#state').val(todoToEdit.state);
        var $spanTags = $('#todo-for-tags span'),
        extTags = todoToEdit.tags.split(' ');
        // TODO: O(2) <--> better ??
        $.each($spanTags, function() {
            var $selectedSpanTag = $(this);
            $.each(extTags, function() {
                if ($selectedSpanTag.text() == this) {
                    $selectedSpanTag.attr('data-clicked', 'true')
                    .addClass($('#menu').attr('class'))
                    .addClass('clicked')
                    .clone().attr('id', 'todo-tag-' + $selectedSpanTag.text())
                    .appendTo($('div#todo-for-tags-hidden'));
                }
            });
        });
    });

    $editTodo.on('click', function() {
        // TODO: variables caching
        todoToEdit.isUrgent = $('input#urgent').attr('checked') ? true : false;
        todoToEdit.isImportant = $('input#important').attr('checked') ? true : false;
        todoToEdit.category = $('select#category').val();
        todoToEdit.name = $('input#name').val();
        todoToEdit.deadline = $('input#deadline').val();
        todoToEdit.description = $('textarea#description').val();
        todoToEdit.state = $('select#state').val();
        todoToEdit.isActive = true;
        todoToEdit.tags = '';
        $('div#todo-for-tags-hidden span').each(function() {
            todoToEdit.tags += $(this).html() + ' ';
        });
        hideNewTodoForm();
        clearTags();
        displayTodos();
    });

    //=================================================//
    //-------------- Modify Todo ----------------------//
    //=================================================//

    $(document).on('change','input[name=active]', function() {
        var parentTable = $(this).parents('table');
        var created = parentTable.find('input[name=created]').val();
        var editButton = parentTable.find('button');
        var newValueForActive;

        if (parentTable.hasClass('disabled')) {
            parentTable.removeClass('disabled');
            newValueForActive = true;
            editButton.removeAttr('disabled');
        } else {
            parentTable.addClass('disabled');
            newValueForActive = false;
            editButton.attr('disabled', 'disabled');    
        }

        $.each(todosJSON, function(index, value) {
            if (value.created == created) {
                value.isActive = newValueForActive;
            }
        });
    });
});