/*
 * All project code connected to tags.
 */
var tagsArr = [];

function displayTags() {
    $ul = $('div.tag-container ul'),

    $todoForTags = $('#todo-for-tags'),
    $searchTags = $('#search-tags');

    $ul.html('');
    $todoForTags.html('');
    $searchTags.html('');
    $.each(tagsArr, function(index, element) {

        var a = index == 0 ? 'class="selected"':'';
        $ul.append($('<li><input type="checkbox" class="checkbox-hidden"/><span '+a+'>' + element + '</span></li>'));
        $todoForTags.append('<span data-bind="text: name" data-clicked="false" unselectable="on">' + element + '</span>');
        $searchTags.append('<option>' + element + '</option>')

    });
}

// sends new tags via AJAX
function ajax_addTags(tags) {
    $.post('php/tags.php', '{ "action" : "add", "tags" : "' + tags + '" }',
        function(answer) {
            
        });
}

$(function() {
    // Get tags via AJAX
    $.post('php/tags.php', '{ "action" : "get" }',
        function(answer) {
            $ul = $('div.tag-container ul');
            $(answer).each(function(index, element) {
                tagsArr.push(element);
            });
            displayTags();
        }, 'json');

    // add a tag
    var $addTag = $('#addtag');
    $addTag.on('click', function() {
        var newTag = $('#newtag').val(),
            pattern = /\S/g;
        if (pattern.test(newTag)) {
            ajax_addTags(newTag);
            tagsArr.push(newTag);
            displayTags();
        }
    });

    // Shows / hides tag checkboxes
    var $deleteTags = $('button#deletetags'),
    $tagsContainer = $('div.tag-container');
    $deleteTags.on('click', function() {
        if ($deleteTags.text() == "Edit") {
            $deleteTags.text('Delete checked');
            $tagsContainer.find('input[type="checkbox"]').removeClass('checkbox-hidden');
        } else {
            $tagsSpans = $tagsContainer.find('input[type="checkbox"]:checked').siblings('span');
            var toBeDeleted = '[';
            $.each($tagsSpans, function(index, element) {
                toBeDeleted += '"' + $(element).html() + '", ';
                tagsArr.pop(element);
            });
            toBeDeleted = toBeDeleted.slice(0, -2);
            toBeDeleted += ']';

            $.post('php/tags.php', '{ "action" : "delete", "tags" : ' + toBeDeleted + ' }',
                function(answer) {
                    // displayTags();
                });

            $deleteTags.text('Edit');
            $tagsContainer.find('input[type="checkbox"]').addClass('checkbox-hidden');
        }
    });
});

// Clears selected tags
function clearTags() {
    $('div#todo-for-tags span').attr('data-clicked', 'false').removeClass();
}

// selects new tags from all new todo tags
function sendNewTags(tags) {
    $.each(tagsArr, function(index, element) {
        var index = tags.indexOf(element);
        if (index != -1) {
            tags = tags.substring(0, index) + tags.substring(index + element.length + 1);
        }
    });

    if (tags.charAt(tags.length - 1) == " ") {
        tags = tags.slice(0, -1);
    }

    if (tags.match('/\S/g')) {
        $.each(tags.split(" "), function(index, element) {
            tagsArr.push(element);
        });
        ajax_addTags(tags);
        displayTags();
    }
}