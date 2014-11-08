/*jshint esnext: true*/

(function () {




    // Requires.

    var setalg = require('set-algebra');

    // Bounds for random element id generation.

    const ID_MIN = 1000000000000000;
    const ID_MAX = 9007199254740992;



    // Element collection object.
    // An ES6 Set-like object that collects unique references to elements.
    // And is extended to query adjacency/incidence information of collected elements.

    var ElementSet = function ElementSet( elements ) {
        this._set = elements !== undefined ? new Set(elements) : new Set();
        this.size = 0;
    };
    ElementSet.prototype.add = function add( value ) {
        this._set.add( value );
        this.size = this._set.size;
        return this;
    };
    ElementSet.prototype.clear = function clear() {
        this._set.clear();
        this.size = 0;
    };
    ElementSet.prototype.delete = function ( value ) {
        var result = this._set.delete( value );
        this.size = this._set.size;
        return result;
    };
    ElementSet.prototype.entries = function entries() {
        return this._set.entries();
    };
    ElementSet.prototype.forEach = function forEach( callbackFn, thisArg ) {
        this._set.forEach( callbackFn, thisArg );
    };
    ElementSet.prototype.has = function has( value ) {
        return this._set.has( value );
    };
    ElementSet.prototype.keys = function keys() {
        return this._set.keys();
    };
    ElementSet.prototype.values = function values() {
        return this._set.values();
    };
    ElementSet.prototype['@@iterator'] = ElementSet.prototype.values; // Required to be iterable.
    ElementSet.prototype.$verts = function $verts() {
        var results = new ElementSet();
        for ( var element of this ) {
            var verts = element.$verts();
            for ( var vert of verts ) {
                results.add( vert );
            }
        }
        return results;
    };
    ElementSet.prototype.$edges = function $edges() {
        var results = new ElementSet();
        for ( var element of this ) {
            var edges = element.$$edges();
            for ( var edge of edges ) {
                results.add( edge );
            }
        }
        return results;
    };
    ElementSet.prototype.$faces = function $faces() {
        var results = new ElementSet();
        for ( var element of this ) {
            var faces = element.$faces();
            for ( var face of faces ) {
                results.add( face );
            }
        }
        return results;
    };



    // AIF mesh elements.

    var Vert = function Vert() {
        this.id = undefined;
        this.annotation = {};
        this.edges = new ElementSet();  // Incident edges.
    };
    Vert.prototype.$verts = function $verts() {
        var results = new ElementSet();
        for ( var edge of this.edges ) {
            results.add( edge.vert1 );
            results.add( edge.vert2 );
        }
        results.delete( this );
        return results;
    };
    Vert.prototype.$edges = function $edges() {
        return new ElementSet( this.edges );
    };
    Vert.prototype.$faces = function $faces() {
        var results = new ElementSet();
        for ( var edge of this.edges ) {
            for ( var face of edge.faces ) {
                results.add(face);
            }
        }
        return results;
    };

    var Edge = function Edge() {
        this.id = undefined;
        this.annotation = {};
        this.vert1 = undefined;         // Adjacent vertex 1.
        this.vert2 = undefined;         // Adjacent vertex 2.
        this.faces = new ElementSet();  // Incident faces.
    };
    Edge.prototype.$verts = function $verts() {
        return new ElementSet([this.vert1, this.vert2]);
    };
    Edge.prototype.$edges = function $edges() {
        var results = new ElementSet();
        var edge;
        for ( edge of this.vert1.edges ) {
            results.add( edge );
        }
        for ( edge of this.vert2.edges ) {
            results.add( edge );
        }
        results.delete( this );
        return results;
    };
    Edge.prototype.$faces = function $faces() {
        return new ElementSet( this.faces );
    };


    var Face = function Face() {
        this.id = undefined;
        this.annotation = {};
        this.edges = new ElementSet();  // Adjacent edges.
    };
    Face.prototype.$verts = function $verts() {
        var results = new ElementSet();
        for ( var edge of this.edges ) {
            results.add( edge.vert1 );
            results.add( edge.vert2 );
        }
        return results;
    };
    Face.prototype.$edges = function $edges() {
        return new ElementSet( this.edges );
    };
    Face.prototype.$faces = function $faces() {
        var results = new ElementSet();
        for ( var edge of this.edges ) {
            for ( var face of edge.faces ) {
                results.add( face );
            }
        }
        results.delete( this );
        return results;
    };



    // Basic AIF mesh.
    // Fully non-manifold, no validation when adding elements.

    var Mesh = function Mesh() {
        this.verts = new Map(); // Table of all vertices.
        this.edges = new Map(); // Table of all edges.
        this.faces = new Map(); // Table of all faces.
    };

    Mesh.prototype.addVert = function addVert( vert ) {
        if ( vert instanceof Vert ) {
            var id = vert.id ? vert.id : Math.floor( Math.random() * ( ID_MAX - ID_MIN + 1 ) );
            vert.id = id;
            this.verts.set( id, vert );
            return vert;
        } else {
            throw new TypeError('Not a vert!');
        }
    };
    Mesh.prototype.addEdge = function addEdge( edge ) {
        if ( edge instanceof Edge ) {
            var id = edge.id ? edge.id : Math.floor( Math.random() * ( ID_MAX - ID_MIN + 1 ) );
            edge.id = id;
            this.edges.set( id, edge );
            return edge;
        } else {
            throw new TypeError('Not an edge!');
        }
    };
    Mesh.prototype.addFace = function addFace( face ) {
        if ( face instanceof Face ) {
            var id = face.id ? face.id : Math.floor( Math.random() * ( ID_MAX - ID_MIN + 1 ) );
            face.id = id;
            this.faces.set( id, face );
            return face;
        } else {
            throw new TypeError('Not a face!');
        }
    };
    Mesh.prototype.deleteVert = function addVert( vert ) {
        if ( vert instanceof Vert ) {
            return this.verts.delete( vert.id );
        } else {
            return this.verts.delete( vert );
        }
    };
    Mesh.prototype.deleteEdge = function addEdge( edge ) {
        if ( edge instanceof Edge ) {
            return this.edges.delete( edge.id );
        } else {
            return this.edges.delete( edge );
        }
    };
    Mesh.prototype.deleteFace = function addFace( face ) {
        if ( face instanceof Face ) {
            return this.faces.delete( face.id );
        } else {
            return this.faces.delete( face );
        }
    };



    // Simple mesh extension.
    // Implements element addition via coordinates or adjacent facets.
    // Still non-manifold, but validates edges and faces against degeneration.

    var SimpleMesh = function SimpleMesh() {
        Mesh.call(this);
    };

    SimpleMesh.validateEdgeLoop = function validate( edges ) {

        var list = [ ...edges ];

        if ( list.length < 3 ) {
            return false;
        }

        var start;
        var chain;

        var v11 = list[0].vert1;
        var v12 = list[0].vert2;
        var v21 = list[1].vert1;
        var v22 = list[1].vert2;
        if ( v11 === v21 ) {
            start = v12;
            chain = v22;
        } else if ( v11 === v22 ) {
            start = v12;
            chain = v21;
        } else if ( v12 === v21 ) {
            start = v11;
            chain = v22;
        } else if ( v12 === v22 ) {
            start = v11;
            chain = v21;
        } else {
            return false;
        }

        for ( var i = 2; i < list.length; i++ ) {
            v21 = list[i].vert1;
            v22 = list[i].vert2;
            if ( chain === v21 ) {
                chain = v22;
            } else if ( chain === v22 ) {
                chain = v21;
            } else {
            return false;
            }
        }

        if ( chain !== start ) {
            return false;
        }

        return true;

    };

    SimpleMesh.prototype = Object.create( SimpleMesh.prototype );
    SimpleMesh.prototype.addVertByCoords = function addVertByCoords( x, y, z ) {
        var vert = new Vert();
        vert.annotation.x = x ? x : 0;
        vert.annotation.y = y ? y : 0;
        vert.annotation.z = z ? z : 0;
        return Mesh.prototype.addVert.call( this, vert );
    };
    SimpleMesh.prototype.addEdgeByVertPair = function addEdgeByVertPair( vert1, vert2, validate ) {
        if ( ( validate || validate === undefined ) && vert1 === vert2 ) {
            throw new TypeError('Degenerate edge!');
        }
        if ( !this.verts.has( vert1.id ) || !this.verts.has( vert2.id ) ) {
            throw new ReferenceError('Vert not in mesh!');
        }
        if ( ( validate || validate === undefined )  && setalg.n(vert1.edges, vert2.edges).size ) {
            throw new ReferenceError('Vert pair already has edge in common!');
        }
        var edge = new Edge();
        edge.vert1 = vert1;
        edge.vert2 = vert2;
        vert1.edges.add( edge );
        vert2.edges.add( edge );
        return Mesh.prototype.addEdge.call( this, edge );
    };
    SimpleMesh.prototype.addFaceByEdgeLoop = function addFaceByEdgeLoop( edges, validate ) {
        if ( ( validate || validate === undefined )  && !SimpleMesh.validateEdgeLoop( edges ) ) {
            throw new TypeError('Degenerate edge-loop!');
        }
        var face = new Face();
        for ( var edge of edges ) {
            if ( !this.edges.has( edge.id ) ) {
                throw new ReferenceError('Edge not in mesh!');
            }
            edge.faces.add( face );
            face.edges.add( edge );
        }
        return Mesh.prototype.addFace.call( this, face );
    };
    SimpleMesh.prototype.addFaceByVertLoop = function addFaceByVertLoop( verts ) {
        if ( verts.length < 3 || verts.size < 3 ) {
            throw new TypeError('Degenerate vert-loop!');
        }
        var list = [ ...verts ];
        var edges = [];
        var previous = list[0];
        var current;
        var commonEdge;
        for ( var i = 1; i < list.length; i++ ) {
            current = list[i];
            commonEdge = setalg.n( previous.edges, current.edges );
            if ( commonEdge.size < 1 ) {
                throw new TypeError('Degenerate vert-loop!');
            }
            edges.push( [ ...commonEdge ][0] );
            previous = current;
        }
        commonEdge = setalg.n( list[list.length-1].edges, list[0].edges );
        if ( commonEdge.size < 1 ) {
            throw new TypeError('Degenerate vert-loop!');
        }
        edges.push( [ ...commonEdge ][0] );
        return this.addFaceByEdgeLoop( edges, false );
    };



    // CommonJS export.

    module.exports = {
        ElementSet:     ElementSet,
        Vert:           Vert,
        Edge:           Edge,
        Face:           Face,
        Mesh:           Mesh,
        SimpleMesh:     SimpleMesh
    };



}).call(this);
