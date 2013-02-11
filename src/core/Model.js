vg.Model = (function() {
  function model() {
    this._defs = null;
    this._axes = [];
    this._data = {};
    this._scales = {};
    this._scene = null;
  }
  
  var prototype = model.prototype;
  
  prototype.defs = function(defs) {
    if (!arguments.length) return this._defs;
    this._defs = defs;
    return this;
  };
  
  prototype.data = function(data) {
    if (!arguments.length) return this._data;

    var tx = this._defs ? this._defs.data.flow : {},
        keys = vg.keys(data), i, len, k;
        
    for (i=0, len=keys.length; i<len; ++i) {
      k = keys[i];
      this._data[k] = tx[k]
        ? tx[k](data[k], this._data, this._defs.marks)
        : data[k];
    }

    return this;
  };
  
  prototype.scene = function(node) {
    if (!arguments.length) return this._scene;
    this._scene = node;
    return this;
  };
  
  prototype.build = function() {
    var m = this,
        scales = m._scales,
        scene = m._scene,
        axes = m._axes,
        data = m._data,
        defs = m._defs;

    m._scene = vg.scene.build.call(m, defs.marks, data, scene);
    vg.parse.scales(defs.scales, scales, data, defs.marks);
    vg.parse.axes(defs.axes, axes, scales);
    return this;
  };
  
  prototype.encode = function(request, item) {
    vg.scene.encode.call(this, this._scene,
      this._defs.marks, null, request, item);
    return this;
  };
  
  prototype.visit = function(pre, post) {
    return vg.scene.visit(this._scene, pre, post);
  };
  
  return model;
})();