File = require '../models/file'

module.exports = class FileCollection extends Backbone.Collection

    # Model that will be contained inside the collection.
    model: File

    # This is where ajax requests the backend.
    url: 'files'