(function() {
  var ID_MIN = 1000000000000000;
  var ID_MAX = 9007199254740992;
  var ElementSet = function ElementSet(elements) {
    this._set = elements instanceof Array ? new Set(elements) : new Set();
    this.size = 0;
  };
  ElementSet.prototype.add = function add(value) {
    this._set.add(value);
    this.size = this._set.size;
    return this;
  };
  ElementSet.prototype.clear = function clear() {
    this._set.clear();
    this.size = 0;
  };
  ElementSet.prototype.delete = function(value) {
    var result = this._set.delete(value);
    this.size = this._set.size;
    return result;
  };
  ElementSet.prototype.entries = function entries() {
    return this._set.entries();
  };
  ElementSet.prototype.forEach = function forEach(callbackFn, thisArg) {
    this._set.forEach(callbackFn, thisArg);
  };
  ElementSet.prototype.has = function has(value) {
    return this._set.has(value);
  };
  ElementSet.prototype.keys = function keys() {
    return this._set.keys();
  };
  ElementSet.prototype.values = function values() {
    return this._set.values();
  };
  ElementSet.prototype['@@iterator'] = ElementSet.prototype.values;
  ElementSet.prototype.$verts = function $verts() {
    var results = new ElementSet();
    for (var $__2 = this[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      var element = $__3.value;
      {
        var verts = element.$verts();
        for (var $__0 = verts[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var vert = $__1.value;
          {
            results.add(vert);
          }
        }
      }
    }
    return results;
  };
  ElementSet.prototype.$edges = function $edges() {
    var results = new ElementSet();
    for (var $__2 = this[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      var element = $__3.value;
      {
        var edges = element.$$edges();
        for (var $__0 = edges[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var edge = $__1.value;
          {
            results.add(edge);
          }
        }
      }
    }
    return results;
  };
  ElementSet.prototype.$faces = function $faces() {
    var results = new ElementSet();
    for (var $__2 = this[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      var element = $__3.value;
      {
        var faces = element.$faces();
        for (var $__0 = faces[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var face = $__1.value;
          {
            results.add(face);
          }
        }
      }
    }
    return results;
  };
  var Vert = function Vert() {
    this.id = undefined;
    this.annotation = {};
    this.edges = new ElementSet();
  };
  Vert.prototype.$verts = function $verts() {
    var results = new ElementSet();
    for (var $__0 = this.edges[Symbol.iterator](),
        $__1; !($__1 = $__0.next()).done; ) {
      var edge = $__1.value;
      {
        results.add(edge.vert1);
        results.add(edge.vert2);
      }
    }
    results.delete(this);
    return results;
  };
  Vert.prototype.$edges = function $edges() {
    return this.edges;
  };
  Vert.prototype.$faces = function $faces() {
    var results = new ElementSet();
    for (var $__2 = this.edges[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      var edge = $__3.value;
      {
        for (var $__0 = edge.faces[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var face = $__1.value;
          {
            results.add(face);
          }
        }
      }
    }
    return results;
  };
  var Edge = function Edge() {
    this.id = undefined;
    this.annotation = {};
    this.vert1 = undefined;
    this.vert2 = undefined;
    this.faces = new ElementSet();
  };
  Edge.prototype.$verts = function $verts() {
    return new ElementSet([this.vert1, this.vert2]);
  };
  Edge.prototype.$edges = function $edges() {
    var results = new ElementSet();
    for (var $__0 = this.vert1.edges[Symbol.iterator](),
        $__1; !($__1 = $__0.next()).done; ) {
      var edge = $__1.value;
      {
        results.add(edge);
      }
    }
    for (var $__2 = this.vert2.edges[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      var edge = $__3.value;
      {
        results.add(edge);
      }
    }
    results.delete(this);
    return results;
  };
  Edge.prototype.$faces = function $faces() {
    return this.faces;
  };
  var Face = function Face() {
    this.id = undefined;
    this.annotation = {};
    this.edges = new ElementSet();
  };
  Face.prototype.$verts = function $verts() {
    var results = new ElementSet();
    for (var $__0 = this.edges[Symbol.iterator](),
        $__1; !($__1 = $__0.next()).done; ) {
      var edge = $__1.value;
      {
        results.add(edge.vert1);
        results.add(edge.vert2);
      }
    }
    return results;
  };
  Face.prototype.$edges = function $edges() {
    return this.edges;
  };
  Face.prototype.$faces = function $faces() {
    var results = new ElementSet();
    for (var $__2 = this.edges[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      var edge = $__3.value;
      {
        for (var $__0 = edge.faces[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var face = $__1.value;
          {
            results.add(face);
          }
        }
      }
    }
    results.delete(this);
    return results;
  };
  var Mesh = function Mesh() {
    this.verts = new Map();
    this.edges = new Map();
    this.faces = new Map();
  };
  Mesh.prototype.addVert = function addVert(vert) {
    if (vert instanceof Vert) {
      var id = vert.id ? vert.id : Math.floor(Math.random() * (ID_MAX - ID_MIN + 1));
      vert.id = id;
      this.verts.set(id, vert);
      return vert;
    } else {
      throw new TypeError('Not a vert!');
    }
  };
  Mesh.prototype.addEdge = function addEdge(edge) {
    if (edge instanceof Edge) {
      var id = edge.id ? edge.id : Math.floor(Math.random() * (ID_MAX - ID_MIN + 1));
      edge.id = id;
      this.edges.set(id, edge);
      return edge;
    } else {
      throw new TypeError('Not an edge!');
    }
  };
  Mesh.prototype.addFace = function addFace(face) {
    if (face instanceof Face) {
      var id = face.id ? face.id : Math.floor(Math.random() * (ID_MAX - ID_MIN + 1));
      face.id = id;
      this.faces.set(id, face);
      return face;
    } else {
      throw new TypeError('Not a face!');
    }
  };
  Mesh.prototype.deleteVert = function addVert(vert) {
    if (vert instanceof Vert) {
      return this.verts.delete(vert.id);
    } else {
      return this.verts.delete(vert);
    }
  };
  Mesh.prototype.deleteEdge = function addEdge(edge) {
    if (edge instanceof Edge) {
      return this.edges.delete(edge.id);
    } else {
      return this.edges.delete(edge);
    }
  };
  Mesh.prototype.deleteFace = function addFace(face) {
    if (face instanceof Face) {
      return this.faces.delete(face.id);
    } else {
      return this.faces.delete(face);
    }
  };
  var SimpleMesh = function SimpleMesh() {
    Mesh.call(this);
  };
  SimpleMesh.prototype = Object.create(SimpleMesh.prototype);
  SimpleMesh.prototype.addVert = function addVert(x, y, z) {
    var vert = new Vert();
    vert.annotation.x = x ? x : 0;
    vert.annotation.y = y ? y : 0;
    vert.annotation.z = z ? z : 0;
    return Mesh.prototype.addVert.call(this, vert);
  };
  SimpleMesh.prototype.addEdge = function addEdge(vert1, vert2) {
    if (vert1 === vert2) {
      throw new TypeError('Degenerate edge!');
    }
    if (!this.verts.has(vert1.id) || !this.verts.has(vert2.id)) {
      throw new ReferenceError('Vert not in mesh!');
    }
    var edge = new Edge();
    edge.vert1 = vert1;
    edge.vert2 = vert2;
    vert1.edges.add(edge);
    vert2.edges.add(edge);
    return Mesh.prototype.addEdge.call(this, edge);
  };
  SimpleMesh.prototype.addFace = function addFace(edges) {
    if (edges.length < 3 || edges.size < 3) {
      throw new TypeError('Degenerate face!');
    }
    var face = new Face();
    for (var $__0 = edges[Symbol.iterator](),
        $__1; !($__1 = $__0.next()).done; ) {
      var edge = $__1.value;
      {
        if (!this.edges.has(edge.id)) {
          throw new ReferenceError('Edge not in mesh!');
        }
        edge.faces.add(face);
        face.edges.add(edge);
      }
    }
    return Mesh.prototype.addFace.call(this, face);
  };
  module.exports = {
    ElementSet: ElementSet,
    Vert: Vert,
    Edge: Edge,
    Face: Face,
    Mesh: Mesh,
    SimpleMesh: SimpleMesh
  };
}).call(this);
