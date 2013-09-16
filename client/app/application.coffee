FolderCollection = require('./collections/folder')
FileCollection = require('./collections/file')


module.exports =

    initialize: ->
        # Used in inter-app communication
        #SocketListener = require '../lib/socket_listener'
        @locale = window.locale
        @polyglot = new Polyglot()
        try
            locales = require 'locales/'+ @locale
        catch e
            locales = require 'locales/en'

        @polyglot.extend locales
        window.t = @polyglot.t.bind @polyglot
        
        # Routing management
        Router = require 'router'
        @router = new Router()
        @folders = new FolderCollection()
        @files = new FileCollection()
        Backbone.history.start()

        # Makes this object immuable.
        Object.freeze this if typeof Object.freeze is 'function'