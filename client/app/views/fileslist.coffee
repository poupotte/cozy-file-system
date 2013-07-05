# This is where we import required modules
BaseView = require '../lib/base_view'
FileView  = require './fileslist_item'
File = require '../models/file'
ViewCollection = require '../lib/view_collection'

module.exports = class FilesListView extends ViewCollection

    template: require('./templates/fileslist')
    itemview: FileView
    el: 'body.application'
    collectionEl: '#file-list'
    @views = {}

    initialize: ->
        super

    events: ->
        'change #uploader' : 'addFile'

    afterRender: ->
        super()
        @uploader = @$('#uploader')[0]
        @$collectionEl.html '<em>loading...</em>'
        @collection.fetch
            success: (collection, response, option) =>
                @$collectionEl.find('em').remove()
            error: =>
                msg = "Files couldn't be retrieved due to a server error."
                @$collectionEl.find('em').html msg


    addFile: ()=>
        attach = @uploader.files[0]
        fileAttributes = {}
        fileAttributes.name = attach.name
        file = new File fileAttributes
        file.file = attach
        @collection.add file
        @upload file


    upload: (file) =>
        formdata = new FormData()
        formdata.append 'cid', file.cid
        formdata.append 'name', file.get 'name'
        formdata.append 'file', file.file
        Backbone.sync 'create', file,
            contentType:false
            data: formdata