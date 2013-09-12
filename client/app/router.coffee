app = require 'application'
HomeView = require 'views/home'
FolderView = require 'views/folder'
Folder = require 'models/folder'


# We'll cover the router in another tutorial.
module.exports = class Router extends Backbone.Router

    routes:
        '': 'main'        
        'folders/:folderid' : 'folder'

    main: ->
        # We create the collection here but do it where it fits the better for
        # your case.
        folder = new Folder id:"root"
        @displayView new FolderView
            model: folder

    folder: (id) ->
        folder = app.folders.get(id) or new Folder id:id
        folder.fetch()
        .done =>
            @displayView new FolderView
            	model: folder
        .fail =>
            alert t 'this album does not exist'
            @navigate 'folders', true 

    # display a page properly (remove previous page)
    displayView: (view) =>
        @mainView.remove() if @mainView
        @mainView = view 
        #console.log @mainView
        el = @mainView.render().$el
        #el.addClass "mode-#{app.mode}"
        $('body').append el