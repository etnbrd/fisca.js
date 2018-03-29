import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import Tax from './tax';

function formatLatestTax(structure) {
  const latestKey = Object.keys(structure)
    .reduce((latestKey, key) =>
      key > latestKey ? key : latestKey, 0
    );

  return new Tax(structure[latestKey]);
}

function taxFromFile(relativePath) {
  const absolutePath = path.join(__dirname, relativePath);
  const file = fs.readFileSync(absolutePath, 'utf8');
  const structure = yaml.safeLoad(file);

  return Object.entries(structure)
    .reduce((taxes, [name, structure]) => ({
      ...taxes,
      [name]: formatLatestTax(structure)
    }), {});

}

export const taxes = {
  ...taxFromFile('../data/impot-revenus.yml'),
  ...taxFromFile('../data/impot-societes.yml'),
  ...taxFromFile('../data/charges.yml'),
  ...taxFromFile('../data/dividendes.yml')
};
