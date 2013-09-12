File = define 'File', ->
    property 'name', String
    property 'slug', String
    property '_attachments', Object

Folder = define 'Folder', ->
    property 'name', String
    property 'slug', String