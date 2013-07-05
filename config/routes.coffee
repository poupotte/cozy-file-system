exports.routes = (map) ->
    # This line is based on a convention that says
    # that all GET requests sent to "/bookmarks/ should be routed
    # to the action "all" written in the file
    # "app/controllers/bookmarks_controller.coffee"
    map.post 'files', 'files#create'
    map.get 'files/:id', 'files#find'
    map.get 'files/:id/attach/:name', 'files#getAttachment'
    map.get 'files', 'files#all'
    map.del 'files/:id', 'files#destroy'