import { fiscalYear } from './exercice';
import { structure } from './structure';


// TODO remove this
import { asTree } from 'treeify';

const treeify = obj => asTree(obj, true);

console.log(" ====== STRUCTURE ====== ");
console.log(treeify(structure));

const result = fiscalYear(structure);



console.log(" ====== RESULT ====== ");
console.log(treeify(result));
