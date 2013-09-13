directoryPlaceholder = '.couchfs-directory-placeholder'


before ->
    # Find file
    File.find req.params.id, (err, folder) =>
        if err or not folder
            send error: true, msg: "Folder not found", 404
        else
            @folder = folder
            next()
# Make this pre-treatment only before destroy action.
, only: ['destroy', 'find', 'getFiles','findFiles', 'findFolders']


before ->
    File.all (err, files) ->
        if err
            send error: true, msg: "Server error occured", 500
        else
            name = req.body.name
            newName = name + '/' + directoryPlaceholder
            alreadyExist = false
            for file in files 
                if file.name is newName
                    alreadyExist = true
                    send error: true, msg: "Folder already exists", 400
            if not alreadyExist
                next()
, only: ['create']


action 'findFoldersRoot', ->
    File.all (err, files) ->
        if err
            send error: true, msg: "Server error occured", 500
        else
            folders = []
            for file in files
                if file.name.split('/')[1] is directoryPlaceholder 
                    file.name = file.name.split('/')[0]
                    folders.push file
            send folders, 200

action 'findFilesRoot', ->
    File.all (err, files) ->
        if err
            send error: true, msg: "Server error occured", 500
        else
            filesRoot = []
            for file in files
                if file.name.split('/').length is 1
                    file.name = file.name.split('/')[0]
                    filesRoot.push file
            send filesRoot, 200

action 'create', ->
    name = req.body.name
    newName = name + '/' + directoryPlaceholder
    req.body.name = newName
    req.body.slug = newName
    File.create req.body, (err, newFolder) =>
        if err
            send error: true, msg: "Server error while creating folder.", 500
        else
            newFolder.name = name
            send newFolder, 200

action 'find', ->
    newName = @folder.name.split('/')
    @folder.name = newName[newName.length-2]    
    send @folder, 200

action 'findFiles', ->
    # Send folders and files in the current folder
    File.all (err, files) =>
        if err
            send error: true, msg:  "Server error occured", 500
        else
            folderFiles = []
            for file in files
                folder = @folder.name.split('/')
                # Test if file or folder is in the current folder
                folderName = @folder.name.replace directoryPlaceholder , ''
                if (file.name.indexOf(folderName) is 0) and
                        (file.id isnt @folder.id)
                    fileName = file.name.replace folderName, ''
                    fileSplit = fileName.split('/')
                    # Test if it is a file in the current folder
                    if fileSplit.length is 1
                        file.name = fileSplit[0]
                        folderFiles.push file
            send folderFiles, 200

action 'findFolders', ->
    # Send folders and files in the current folder
    File.all (err, files) =>
        if err
            send error: true, msg:  "Server error occured", 500
        else
            folders = []
            for file in files
                folder = @folder.name.split('/')
                # Test if file or folder is in the current folder
                folderName = @folder.name.replace directoryPlaceholder , ''
                if (file.name.indexOf(folderName) is 0) and 
                        (file.id isnt @folder.id)
                    fileName = file.name.replace folderName, ''
                    fileSplit = fileName.split('/')
                    # Test if it is a folder in the current folder
                    if (fileSplit.length is 2) and
                            (fileSplit[1] is directoryPlaceholder )
                        file.name = fileSplit[0]
                        folders.push file
            send folders, 200

action 'destroy', ->
    File.all (err, files) =>
        if err
            send error: true, msg:  "Server error occured", 500
        else
            folderName = @folder.name.replace directoryPlaceholder , ''
            for file in files
                if (file.name.indexOf(folderName) is 0)
                    file.destroy (err) ->
                        console.log err if err
            @folder.destroy (err) ->
                if err
                    compound.logger.write err
                    send error: 'Cannot destroy folder', 500
                else
                    send success: 'Folder succesfuly deleted', 200