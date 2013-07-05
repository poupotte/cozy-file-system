module.exports = (compound, File) ->
    File.all = (params, callback) ->
        # Here we use the Data System API, We retrieve our data through a request
        # defined at application initialization.
        File.request "all", params, callback