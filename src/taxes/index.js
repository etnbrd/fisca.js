import json from './taxes.json';
import Tax from './tax';

function formatLatestTax(structure) {
  const latestKey = Object.keys(structure)
    .reduce((latestKey, key) =>
      key > latestKey ? key : latestKey, 0
    );

  return new Tax(structure[latestKey]);
}

function formatTaxes(taxes) {
  return {
    ...Object.entries(taxes)
      .reduce((groupes, [name, group]) => ({
        ...groupes,
        [name]: Object.entries(group)
          .reduce((taxes, [name, tax]) => ({
            ...taxes,
            [name]: formatLatestTax(tax)
          }), {})
      }), {})
  }
}

export default formatTaxes(json);
