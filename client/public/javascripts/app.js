(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  module.exports = {
    initialize: function() {
      var Router;
      Router = require('router');
      this.router = new Router();
      Backbone.history.start();
      if (typeof Object.freeze === 'function') {
        return Object.freeze(this);
      }
    }
  };
  
});
window.require.register("collections/file", function(exports, require, module) {
  var File, FileCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  File = require('../models/file');

  module.exports = FileCollection = (function(_super) {
    __extends(FileCollection, _super);

    function FileCollection() {
      _ref = FileCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FileCollection.prototype.model = File;

    FileCollection.prototype.url = 'files';

    return FileCollection;

  })(Backbone.Collection);
  
});
window.require.register("helpers", function(exports, require, module) {
  exports.BrunchApplication = (function() {
    function BrunchApplication() {
      var _this = this;
      $(function() {
        _this.initialize(_this);
        return Backbone.history.start();
      });
    }

    BrunchApplication.prototype.initializeJQueryExtensions = function() {
      return $.fn.spin = function(opts, color) {
        var presets;
        presets = {
          tiny: {
            lines: 8,
            length: 2,
            width: 2,
            radius: 3
          },
          small: {
            lines: 8,
            length: 1,
            width: 2,
            radius: 5
          },
          large: {
            lines: 10,
            length: 8,
            width: 4,
            radius: 8
          }
        };
        if (Spinner) {
          return this.each(function() {
            var $this, spinner;
            $this = $(this);
            spinner = $this.data("spinner");
            if (spinner != null) {
              spinner.stop();
              return $this.data("spinner", null);
            } else if (opts !== false) {
              if (typeof opts === "string") {
                if (opts in presets) {
                  opts = presets[opts];
                } else {
                  opts = {};
                }
                if (color) {
                  opts.color = color;
                }
              }
              spinner = new Spinner($.extend({
                color: $this.css("color")
              }, opts));
              spinner.spin(this);
              return $this.data("spinner", spinner);
            }
          });
        } else {
          console.log("Spinner class not available.");
          return null;
        }
      };
    };

    BrunchApplication.prototype.initialize = function() {
      return null;
    };

    return BrunchApplication;

  })();

  exports.selectAll = function(input) {
    return input.setSelection(0, input.val().length);
  };

  exports.slugify = require("./lib/slug");

  exports.getPathRegExp = function(path) {
    var slashReg;
    slashReg = new RegExp("/", "g");
    return "^" + (path.replace(slashReg, "\/"));
  };

  exports.extractTags = function(description) {
    var hashTags, tag, tagSlug, tags, _i, _len;
    hashTags = description.match(/#(\w)*/g);
    tags = [];
    if (hashTags != null) {
      for (_i = 0, _len = hashTags.length; _i < _len; _i++) {
        tag = hashTags[_i];
        if (tag === "#t") {
          tag = "#today";
        }
        if (tag === "#w") {
          tag = "#week";
        }
        if (tag === "#m") {
          tag = "#month";
        }
        if (tag !== "#") {
          tagSlug = tag.substring(1);
          tagSlug = this.slugify(tagSlug);
          tags.push(tagSlug);
        }
      }
    }
    return tags;
  };
  
});
window.require.register("helpers/client", function(exports, require, module) {
  exports.request = function(type, url, data, callbacks) {
    return $.ajax({
      type: type,
      url: url,
      data: data,
      success: callbacks.success,
      error: callbacks.error
    });
  };

  exports.get = function(url, callbacks) {
    return exports.request("GET", url, null, callbacks);
  };

  exports.post = function(url, data, callbacks) {
    return exports.request("POST", url, data, callbacks);
  };

  exports.put = function(url, data, callbacks) {
    return exports.request("PUT", url, data, callbacks);
  };

  exports.del = function(url, callbacks) {
    return exports.request("DELETE", url, null, callbacks);
  };
  
});
window.require.register("initialize", function(exports, require, module) {
  var app;

  app = require('application');

  $(function() {
    require('lib/app_helpers');
    return app.initialize();
  });
  
});
window.require.register("lib/app_helpers", function(exports, require, module) {
  (function() {
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                   group,groupCollapsed,groupEnd,info,log,markTimeline,\
                   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
});
window.require.register("lib/base_view", function(exports, require, module) {
  var BaseView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView() {
      _ref = BaseView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseView.prototype.template = function() {};

    BaseView.prototype.initialize = function() {};

    BaseView.prototype.getRenderData = function() {
      var _ref1;
      return {
        model: (_ref1 = this.model) != null ? _ref1.toJSON() : void 0
      };
    };

    BaseView.prototype.render = function() {
      this.beforeRender();
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };

    BaseView.prototype.beforeRender = function() {};

    BaseView.prototype.afterRender = function() {};

    BaseView.prototype.destroy = function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      return Backbone.View.prototype.remove.call(this);
    };

    return BaseView;

  })(Backbone.View);
  
});
window.require.register("lib/view_collection", function(exports, require, module) {
  var BaseView, ViewCollection, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = ViewCollection = (function(_super) {
    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.removeItem = __bind(this.removeItem, this);
      this.addItem = __bind(this.addItem, this);
      _ref = ViewCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ViewCollection.prototype.itemview = null;

    ViewCollection.prototype.views = {};

    ViewCollection.prototype.template = function() {
      return '';
    };

    ViewCollection.prototype.itemViewOptions = function() {};

    ViewCollection.prototype.collectionEl = null;

    ViewCollection.prototype.onChange = function() {
      return this.$el.toggleClass('empty', _.size(this.views) === 0);
    };

    ViewCollection.prototype.appendView = function(view) {
      return this.$collectionEl.append(view.el);
    };

    ViewCollection.prototype.initialize = function() {
      var collectionEl;
      ViewCollection.__super__.initialize.apply(this, arguments);
      this.views = {};
      this.listenTo(this.collection, "reset", this.onReset);
      this.listenTo(this.collection, "add", this.addItem);
      this.listenTo(this.collection, "remove", this.removeItem);
      if (this.collectionEl == null) {
        return collectionEl = el;
      }
    };

    ViewCollection.prototype.render = function() {
      var id, view, _ref1;
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        view.$el.detach();
      }
      return ViewCollection.__super__.render.apply(this, arguments);
    };

    ViewCollection.prototype.afterRender = function() {
      var id, view, _ref1;
      this.$collectionEl = $(this.collectionEl);
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        this.appendView(view.$el);
      }
      this.onReset(this.collection);
      return this.onChange(this.views);
    };

    ViewCollection.prototype.remove = function() {
      this.onReset([]);
      return ViewCollection.__super__.remove.apply(this, arguments);
    };

    ViewCollection.prototype.onReset = function(newcollection) {
      var id, view, _ref1;
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        view.remove();
      }
      return newcollection.forEach(this.addItem);
    };

    ViewCollection.prototype.addItem = function(model) {
      var options, view;
      options = _.extend({}, {
        model: model
      }, this.itemViewOptions(model));
      view = new this.itemview(options);
      this.views[model.cid] = view.render();
      this.appendView(view);
      return this.onChange(this.views);
    };

    ViewCollection.prototype.removeItem = function(model) {
      this.views[model.cid].remove();
      delete this.views[model.cid];
      return this.onChange(this.views);
    };

    return ViewCollection;

  })(BaseView);
  
});
window.require.register("models/file", function(exports, require, module) {
  var Bookmark, client, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  client = require("../helpers/client");

  module.exports = Bookmark = (function(_super) {
    __extends(Bookmark, _super);

    function Bookmark() {
      _ref = Bookmark.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Bookmark.prototype.rootUrl = 'files';

    Bookmark.prototype.prepareCallbacks = function(callbacks, presuccess, preerror) {
      var error, success, _ref1,
        _this = this;
      _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
      if (presuccess == null) {
        presuccess = function(data) {
          return _this.set(data.app);
        };
      }
      this.trigger('request', this, null, callbacks);
      callbacks.success = function(data) {
        if (presuccess) {
          presuccess(data);
        }
        _this.trigger('sync', _this, null, callbacks);
        if (success) {
          return success(data);
        }
      };
      return callbacks.error = function(jqXHR) {
        if (preerror) {
          preerror(jqXHR);
        }
        _this.trigger('error', _this, jqXHR, {});
        if (error) {
          return error(jqXHR);
        }
      };
    };

    Bookmark.prototype.getAttachment = function(file, callbacks) {
      this.prepareCallbacks(callbacks);
      return client.post("/files/" + this.id + "/getAttachment/" + this.name, callbacks);
    };

    return Bookmark;

  })(Backbone.Model);
  
});
window.require.register("router", function(exports, require, module) {
  var FileCollection, FilesView, Router, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FilesView = require('views/fileslist');

  FileCollection = require('collections/file');

  module.exports = Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.routes = {
      '': 'main'
    };

    Router.prototype.main = function() {
      var mainView;
      mainView = new FilesView({
        collection: new FileCollection()
      });
      return mainView.render();
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("views/fileslist", function(exports, require, module) {
  var BaseView, File, FileView, FilesListView, ViewCollection, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

  FileView = require('./fileslist_item');

  File = require('../models/file');

  ViewCollection = require('../lib/view_collection');

  module.exports = FilesListView = (function(_super) {
    __extends(FilesListView, _super);

    function FilesListView() {
      this.upload = __bind(this.upload, this);
      this.addFile = __bind(this.addFile, this);
      _ref = FilesListView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FilesListView.prototype.template = require('./templates/fileslist');

    FilesListView.prototype.itemview = FileView;

    FilesListView.prototype.el = 'body.application';

    FilesListView.prototype.collectionEl = '#file-list';

    FilesListView.views = {};

    FilesListView.prototype.initialize = function() {
      return FilesListView.__super__.initialize.apply(this, arguments);
    };

    FilesListView.prototype.events = function() {
      return {
        'change #uploader': 'addFile'
      };
    };

    FilesListView.prototype.afterRender = function() {
      var _this = this;
      FilesListView.__super__.afterRender.call(this);
      this.uploader = this.$('#uploader')[0];
      this.$collectionEl.html('<em>loading...</em>');
      return this.collection.fetch({
        success: function(collection, response, option) {
          return _this.$collectionEl.find('em').remove();
        },
        error: function() {
          var msg;
          msg = "Files couldn't be retrieved due to a server error.";
          return _this.$collectionEl.find('em').html(msg);
        }
      });
    };

    FilesListView.prototype.addFile = function() {
      var attach, file, fileAttributes;
      attach = this.uploader.files[0];
      fileAttributes = {};
      fileAttributes.name = attach.name;
      file = new File(fileAttributes);
      file.file = attach;
      this.collection.add(file);
      return this.upload(file);
    };

    FilesListView.prototype.upload = function(file) {
      var formdata;
      formdata = new FormData();
      formdata.append('cid', file.cid);
      formdata.append('name', file.get('name'));
      formdata.append('file', file.file);
      return Backbone.sync('create', file, {
        contentType: false,
        data: formdata
      });
    };

    return FilesListView;

  })(ViewCollection);
  
});
window.require.register("views/fileslist_item", function(exports, require, module) {
  var BaseView, FileListsItemView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

  module.exports = FileListsItemView = (function(_super) {
    __extends(FileListsItemView, _super);

    function FileListsItemView() {
      _ref = FileListsItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FileListsItemView.prototype.className = 'file';

    FileListsItemView.prototype.tagName = 'div';

    FileListsItemView.prototype.template = require('./templates/fileslist_item');

    FileListsItemView.prototype.events = {
      'click .delete-button': 'onDeleteClicked'
    };

    FileListsItemView.prototype.onDeleteClicked = function() {
      this.$('.delete-button').html("deleting...");
      return this.model.destroy({
        error: function() {
          alert("Server error occured, file was not deleted.");
          return this.$('.delete-button').html("delete");
        }
      });
    };

    return FileListsItemView;

  })(BaseView);
  
});
window.require.register("views/templates/fileslist", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"><h1>Cozy file</h1><input id="uploader" type="file"/><div id="file-list"></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/fileslist_item", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<a');
  buf.push(attrs({ 'href':("files/" + (model.id) + "/attach/" + (model.name) + ""), 'target':("_blank") }, {"href":true,"target":true}));
  buf.push('>' + escape((interp = model.name) == null ? '' : interp) + '</a><button class="delete-button">Delete</button>');
  }
  return buf.join("");
  };
});
