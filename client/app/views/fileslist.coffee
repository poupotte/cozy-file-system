# This is where we import required modules
BaseView = require '../lib/base_view'
FileView  = require './fileslist_item'
# This is where we import required modules
BaseView = require '../lib/base_view'
FileView = require './fileslist_item'
File = require '../models/file'
ViewCollection = require '../lib/view_collection'

module.exports = class FilesListView extends ViewCollection

    template: require('./templates/fileslist')
    itemview: FileView
    collectionEl: '#file-list'
    @views = {}

    initialize: (data) ->
        super
        @repository = ""
        if data.repository?
            @repository = data.repository

    afterRender: ->
        super()
        
    addFile: (attach)=>
        fileAttributes = {}
        fileAttributes.name = attach.name
        file = new File fileAttributes
        file.file = attach
        @collection.add file
        @upload file


    upload: (file) =>
        formdata = new FormData()
        formdata.append 'cid', file.cid
        formdata.append 'name', @repository + file.get 'name'
        formdata.append 'file', file.file
        Backbone.sync 'create', file,
            contentType: false
            data: formdata
        #@collection._byId[file.cid].render()
