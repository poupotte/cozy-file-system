app = require 'application'
FolderView = require 'views/folder'
Folder = require 'models/folder'

directoryPlaceholder = '/.couchfs-directory-placeholder'


# We'll cover the router in another tutorial.
module.exports = class Router extends Backbone.Router

    routes:
        '': 'main'        
        'folders/:folderid' : 'folder'

    main: ->
        folder = new Folder id:"root", rep:""
        @displayView new FolderView
            model: folder

    folder: (id) ->
        initView = (folder) =>
            rep = folder.attributes.slug.replace directoryPlaceholder, ''
            folder.attributes.rep = rep
            @displayView new FolderView
                model: folder

        if app.folders.get(id)
            folder = app.folders.get(id)
            initView folder
        else
            folder = new Folder id:id
            folder.get 
                success: (data) =>
                    folder.set data
                    initView folder

    # display a page properly (remove previous page)
    displayView: (view) =>
        @mainView.remove() if @mainView
        @mainView = view 
        el = @mainView.render().$el
        $('body').append el