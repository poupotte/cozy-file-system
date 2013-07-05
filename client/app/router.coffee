FilesView = require 'views/fileslist'
FileCollection = require 'collections/file'


# We'll cover the router in another tutorial.
module.exports = class Router extends Backbone.Router

    routes:
        '': 'main'

    main: ->
        # We create the collection here but do it where it fits the better for
        # your case.
        mainView = new FilesView
                            collection: new FileCollection()
        mainView.render()