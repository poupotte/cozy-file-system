before ->
    # Find file
    File.find req.params.id, (err, file) =>
        if err or not file
            send error: true, msg: "File not found", 404
        else
            @file = file
            next()
# Make this pre-treatment only before destroy action.
, only: ['destroy', 'find', 'getAttachment']

action 'find', ->
    send @file, 200


action 'all', ->
    File.all (err, files) ->
        if err
            send error: true, msg: "Server error occured while retrieving data.", 500
        else
            send files, 200

action 'create', ->
    file = req.files["file"]
    File.create req.body, (err, newfile) =>
        if err
            send error: true, msg: "Server error while creating file.", 500
        else
            newfile.attachFile file.path, {name: file.name}, (err) ->
                if err
                    send error: true, msg: "Server error while add attachment file.", 500
                else
                    send newfile, 200


action 'getAttachment', ->
    name = params.name

    @file.getFile name, (err, resp, body) ->
        if err or not resp?
            send 500
        else if resp.statusCode is 404
            send 'File not found', 404
        else if resp.statusCode != 200
            send 500
        else
            send 200
    .pipe(res) # this is compound "magic" res = response variable


action 'destroy', ->
    @file.destroy (err) ->
        if err
            compound.logger.write err
            send error: 'Cannot destroy file', 500
        else
            send success: 'File succesfuly deleted', 200