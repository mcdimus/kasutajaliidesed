/*
 * All project code connected to tags.
 */
var tagsArr = [];

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

    // Shows / hides tag checkboxes
    var $deleteTags = $('button#deletetags');
    $deleteTags.on('click', function() {
        if ($deleteTags.text() == "Edit") {
            $deleteTags.text('Delete checked');
            $('div.tag-container input[type="checkbox"]').removeClass('checkbox-hidden');
        } else {
            $deleteTags.text('Edit');
            $('div.tag-container input[type="checkbox"]').addClass('checkbox-hidden');
        }
    });
});

// Clears selected tags
function clearTags() {
    $('div#todo-for-tags span').attr('data-clicked', 'false').removeClass();
}

// sends new tags via AJAX
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

    $.each(tags.split(" "), function(index, element) {
        tagsArr.push(element);
    });

    $.post('php/tags.php', '{ "action" : "add", "tags" : "' + tags + '" }',
        function(answer) {
            $('div#phpanswer').text(answer);
    });
    
    displayTags();
}

function displayTags() {
    $ul = $('div.tag-container ul'),
        $todoForTags = $('#todo-for-tags');
    $ul.html('');
    $todoForTags.html('');
    $.each(tagsArr, function(index, element) {
        $ul.append($('<li><input type="checkbox" class="checkbox-hidden"/><span>' + element + '</span></li>'));
        $todoForTags.append('<span data-bind="text: name" data-clicked="false" unselectable="on">' + element + '</span>');  
    });
}