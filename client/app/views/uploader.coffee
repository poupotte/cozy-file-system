BaseView = require '../lib/base_view'
app = require '../../application'

module.exports = class Uploader extends BaseView

    className: 'uploader'
    tagName: 'div'
    template: require('./templates/uploader')

    # Register listener
    events: ->
          'change #uploader' : 'addFile'

    afterRender: ->
        super()
        @uploader = @$('#uploader')[0]
       

    addFile: ()=>
        attach = @uploader.files[0]
        fileAttributes = {}
        fileAttributes.name = attach.name
        file = new File fileAttributes
        file.file = attach
        @upload file


    upload: () =>
        formdata = new FormData()
        formdata.append 'cid', file.cid
        formdata.append 'name', file.get 'name'
        formdata.append 'file', file.file
        Backbone.sync 'create', file,
            contentType:false
            data: formdata    


    handleFiles: (file)=>
        # handle files
        fileAttributes = {}
        fileAttributes =
            title: file.name
            artist: ""
            album: ""
        file = new File fileAttributes
        file.file = file
        app.files.unshift file,
            sort: false
        file.set
            state: 'client'
        Backbone.Mediator.publish 'uploader:addFile'

        @uploadQueue.push file , (err, file) =>
            if err
                console.log err
                # remove the track(it's already done if upload was canceled)
                app.files.remove file