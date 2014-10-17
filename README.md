# AIF Mesh

A naïve and high-level implementation of the Adjacency and Incidence Framework mesh data-structure.

Original papers by Frutuoso G. M. Silva & Abel J. P. Gomes:

- [A B-Rep Data Structure for Polygonal Meshes](http://virtual.inesc.pt/aicg04/papers/01_FrutuosoACGP.pdf)
- [Adjacency and Incidence Framework - A Data Structure for Effecient and Fast Management of Multiresolution meshes.](http://ldc.usb.ve/~vtheok/papers/tesis/A_data_structure_for_eficient_and_fast_management_of_multire.pdf)

## Platform

The implementation is written in Javascript and uses Maps, Sets, and for-of statements that are part of the ECMAScript version 6 speicification still under development.

However, most modern browsers, and Node.js v0.11 with the `--harmony` flag, can run these just fine right now.

Transpiled ES5 versions have still been included for the UMD and CommonJS versions regardless. The CommonJS version, or rather, the NPM module, automatically loads the ES5 version if the ES6 one fails to. But the specific UMD version will have to be added to an HTML file manually.

## Brief Outline

All the geometric elements of the mesh only contain references to their adjacent and incident elements. 

These elements also have querying functions to retrieve their immediate and extrapolated references: `$verts`, `$edges`, `$faces` all respective return adjoint verts, edges, and faces of any vert, edge, or face.

Furthermore, each of these functions return the results in a special (Es6) `Set`-like object which has the same querying methods that it runs on all collected elements and return another such `Set`-like object. Queries can be chained with this.

The adjacency and incidence relations are all that the structure concerns itself with. Any other information, such as coordiantes of the verts, or metadata of a particular face, should go on the arbitrary object of the `annotation` property. The `BasicMesh` does exactly that.

The mesh object, however, does expose all its concent `verts`, `edges`, and `faces` as (ES6) `Map` objects for batch processing required by any algorithm that uses these structures.

## Documentation, Tests, etc.

Having written this implementation for a quick prototype, I haven't had the chance to write any of it. If my prototype gets anywhere, I plan on cleaning it up with proper API documentation, tests, and usage examples. 

( It'll still be a bit weird what with relying on ES6 features despite not being an ES6 module or using ES6 classes. In particular trying to extend the built-in Set class was an attempt in futility that the ES6 classes promise to fix. )

The source file [`aifm-es6.js`](https://github.com/5310/aif-mesh/blob/master/aifm-es6.js) should be sensible enough to infer usage, I think. Please take a look there if you want more!

## Roadmap

0. Find or create a separate set operations library.
1. Remove element-in-common queries and use set operations instead.
2. Add a cell element relations and naïve `addVolume` helpers. 
   -  Validating potentially degenerate arbitrary valence cells on `SimpleMesh` is out of the question! Let it focus on being a surface-mesh.
3. Make proper!
4. Implement a tetra-mesh volume mesh with proper validation.