BaseView = require '../lib/base_view'

module.exports = class FileListsItemView extends BaseView

    # This time the html component does not exist in the dom.
    # So, we don't refer to a DOM element, we just give
    # class and tag names to let backbone build the component.
    className: 'folder'
    tagName: 'div'

    # The template render the bookmark with data given by the model
    template: require './templates/folderslist_item'

    # Register event
    events: ->
        'click .delete-button': 'onDeleteClicked'
        'click .show-button': 'onShowClicked'

    initialize: ->
        super
        @listenTo @model, 'change:id', @render

    onDeleteClicked: ->
        @$('.delete-button').html "deleting..."
        @model.destroy
            error: ->
                alert "Server error occured, file was not deleted."
                @$('.delete-button').html "delete"

