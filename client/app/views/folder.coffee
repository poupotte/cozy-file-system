BaseView = require '../lib/base_view'
FilesList = require './fileslist'
FileCollection = require '../collections/file'
FolderCollection = require '../collections/folder'
FoldersList = require './folderslist'
Folder = require '../models/folder'
app = require 'application'

directoryPlaceholder = '.couchfs-directory-placeholder'

module.exports = class AppView extends BaseView

    template: require('./templates/folder')
    id: 'folder'   
    className: 'container-fluid'


    events: ->  
        'click .add': 'onAddFolder'
        'change #uploader': 'onAddFile'

    afterRender: ->
        super
        @name = @$('#name')
        @uploader = @$('#uploader')[0]

        @model.findFiles 
            success: (files) =>
                app.files.add files 
                collection = new FileCollection files
                if @model.attributes.id is 'root'
                    @repository = ""
                else
                    @repository = @model.attributes.slug.replace directoryPlaceholder , ''
                data = 
                    collection: collection 
                    repository: @repository
                @filesList = new FilesList data
                @$('#files').append @filesList.$el
                @filesList.render()  
            error: (error) =>
                console.log error

        @model.findFolders 
            success: (folders) =>
                app.folders.add folders
                collection = new FolderCollection folders
                if @model.attributes.id is 'root'
                    @repository = ""
                else
                    @repository = @model.attributes.slug.replace directoryPlaceholder , ''
                data = 
                    collection: collection 
                    repository: @repository
                @foldersList = new FoldersList data
                @$('#folders').append @foldersList.$el 
                @foldersList.render()
            error: (error) =>
                console.log error


    onAddFolder: =>
        folder = new Folder name: @repository + @name.val()
        err = folder.validate folder.attributes
        if err
            alert "The folder name is empty"
        else
            @foldersList.onAddFolder folder.attributes


    onAddFile: =>
        for attach in @uploader.files
            @filesList.addFile attach