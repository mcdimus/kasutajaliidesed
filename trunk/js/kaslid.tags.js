/*
 * All project code connected to tags.
 */
// Get tags via AJAX
$(function() {
    $.post('php/tags.php', '{ "action" : "get" }',
        function(answer) {
            $ul = $('div.tag-container ul');
            $(answer).each(function(index, element) {
                $ul.append($('<li><input type="checkbox" class="checkbox-hidden"/><span>' + element + '</span></li>'));
            });
    }, 'json');
});

// Clear selected tags
function clearTags() {
    $('div#todo-for-tags-hidden span').remove();
    $('div#todo-for-tags span').attr('data-clicked', 'false')
    .removeClass();
}

function Tag(name, checked) {
    return {
        name : ko.observable(name),
        isChecked : ko.observable(checked)
    };
}

function appViewModel() {
    var self = this;

    // ======================================================
    // == tag ViewModel
    // ======================================================
    // observable variables
    self.tags =
    ko.observableArray([
        new Tag("school",false),
        new Tag("birthday",false),
        new Tag("meeting",false),
        new Tag("work",false)
        ]);

    self.newTagName = ko.observable("");

    // functions on observables
    self.addTag = function () {
        if (self.newTagName() != "")
            self.tags.push(new Tag(self.newTagName(), false));
    };

    // DOES NOT WORK!!!
    self.addTagOnEnter = function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 13) {
            this.addTag();
            return false;
        }
        return true;
    }

    self.deleteTags = function() {
        var selectedTags = $.grep(self.tags(), function(tag) {
            return (tag.isChecked());
        });

        $(selectedTags).each( function(index, tag) {
            self.tags.remove(tag);
            $('span#todo-tag-' + tag.name()).remove();
        });
    };
}

$(document).ready(function() {

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

    ko.applyBindings(new appViewModel());

});