import { asTree } from 'treeify';

import { fiscalYear } from './exercice';

import fisca from 'fisca.js';

const revenues = [{
  label: 'clients',
  amount: 100000
}]

const costs = [{
  label: 'consommables',
  amount: 5000
}, {
  label: 'frais de bouche',
  amount: 5000
}]

const employees = [{
  label: 'moi',
  gross_monthly_salary: 3750,
  cadre: true
}]

const structure = {
  label: 'mon entreprise',
  status: 'sasu',
  revenues,
  costs,
  employees
};

const treeify = obj => asTree(obj, true);

console.log(" ====== STRUCTURE ====== ");
console.log(treeify(structure));

const result = fiscalYear(structure);

console.log(" ====== RESULT ====== ");
console.log(treeify(result));


console.log("fisca : ", fisca);
