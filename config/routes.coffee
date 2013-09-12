exports.routes = (map) ->
    # This line is based on a convention that says
    # that all GET requests sent to "/bookmarks/ should be routed
    # to the action "all" written in the file
    # "app/controllers/bookmarks_controller.coffee"

    # Files
    map.post 'files', 'files#create'
    map.get 'files/:id', 'files#find'
    map.get 'files/:id/attach/:name', 'files#getAttachment'
    map.get 'files', 'files#all'
    map.del 'files/:id', 'files#destroy'

    # Folders
    map.post 'folders', 'folders#create'
    map.get 'folders/:id', 'folders#find'
    map.get 'folders/root', 'folders#findRoot'
    map.get 'folders/root/files', 'folders#findFilesRoot'
    map.get 'folders/root/folders', 'folders#findFoldersRoot'
    map.get 'folders/:id/files', 'folders#findFiles'
    map.get 'folders/:id/folders', 'folders#findFolders'
    map.get 'folders', 'folders#all'
    map.del 'folders/:id', 'folders#destroy'