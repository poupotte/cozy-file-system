module.exports = (compound) ->

    File = compound.models.File

    all = (doc) ->
        # That means retrieve all docs and order them by title.
        emit doc.title, doc

    File.defineRequest "all", all, (err) ->
        if err
            compound.logger.write "File.All requests, cannot be created"
            compound.logger.write err
