import ImportOBJ from './ImportOBJ';
import ImportSGL from './ImportSGL';
import ImportSTL from './ImportSTL';
import ImportPLY from './ImportPLY';
import ImportGLB from './ImportGLB';

var Import = {};

Object.assign(Import, ImportOBJ, ImportSGL, ImportSTL, ImportPLY, ImportGLB);

export default Import;
