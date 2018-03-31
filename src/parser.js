import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import Tax from './tax';

const excludes = ['__defs__'];

function yamlFile(relativePath) {
  const absolutePath = path.join(__dirname, relativePath);
  const file = fs.readFileSync(absolutePath, 'utf8');
  return yaml.safeLoad(file);
}

function formatLatestTax(structure) {
  const latestKey = Object.keys(structure)
    .reduce((latestKey, key) =>
      key > latestKey ? key : latestKey, 0
    );

  return new Tax(structure[latestKey]);
}

function taxFromFile(relativePath) {
  const groupes = yamlFile(relativePath);

  return Object.entries(groupes)
    .filter(([name, ..._]) => !excludes.includes(name))
    .reduce((groupes, [name, groupe]) => ({
      ...groupes,
      [name]: Object.entries(groupe).reduce((taxes, [name, tax]) => ({
          ...taxes,
          [name]: formatLatestTax(tax)
        }), {})
    }), {});
}


export const taxes = {
  ...taxFromFile('../data/taxes/impot-revenus.yml'),
  ...taxFromFile('../data/taxes/impot-societes.yml'),
  ...taxFromFile('../data/taxes/charges.yml'),
  ...taxFromFile('../data/taxes/dividendes.yml')
};

function statutFromFile(relativePath) {
  return yamlFile(relativePath);
}

export const status = {
  sasu: statutFromFile('../data/status/sasu.yml')
}
