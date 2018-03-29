import Tax from './tax';
import { taxes } from './data';

import * as Outcomes from './sasu';

const defaultDividendDistribution = RatioDividendDistribution(1);

function RatioDividendDistribution(ratio) {
  return (income) => ({
    to_dividend: income * ratio,
    to_liquid: income * (1 - ratio)
  });
}

const {
  impot_revenu,
  impot_societes,
  charges_salariales,
  charges_patronales,
  dividend_sasu,
  dividend_eurl
} = taxes;

const dividend_tax = {
  SASU: dividend_sasu,
  EURL: dividend_eurl
}


// ACCRE
// https://www.service-public.fr/particuliers/vosdroits/F11677

// ACCRE Micro-entreprises
// https://www.service-public.fr/professionnels-entreprises/vosdroits/F32318

// We have the concept of a regressive tax by income, which is a super set of a flat tax
// We need the concept of a regressive tax by time, which is a super set of a regressive tax
// -> for this period of time, this specific regressive tax applies ...
// We need taxes that behave according to other external factors (though it could be a factory tax: a tax that returns a tax)

function sum_group(outcomes) {
  return outcomes.reduce((sum, outcome) => sum + outcome.amount, 0);
}

function compute_costs(structure) {
  const salaries = compute_salaries(structure);

  const group = [
    ...structure.costs,
    salaries
  ];

  const amount = sum_group(group);

  return {
    label: 'Coûts',
    id: 'costs',
    type: 'group',
    amount,
    group
  }
}

function compute_salaries({ status, employees }) {

  return employees.reduce((result, employee) => {
    const salary = compute_salary({ status }, employee);

    return {
      ...result,
      amount: result.amount + salary.amount,
      group: [
        ...result.group,
        salary
      ]
    };
  }, {
    label: 'Salaires',
    type: 'group',
    amount: 0,
    group: []
  })
}


function compute_salary({ status }, { label, gross_monthly_salary }) {

  const {
    outcome: net_monthly_salary,
    tax: monthly_charges_salariales
  } = charges_salariales.compute(gross_monthly_salary);

  const {
    tax: monthly_charges_patronales
  } = charges_patronales.compute(gross_monthly_salary);

  return {
    label: 'Salaire [ ' + label + ' ]',
    type: 'group',
    amount: net_monthly_salary * 12
          + monthly_charges_salariales * 12
          + monthly_charges_patronales * 12,
    group: [{
      label: 'charges patronale [ ' + label + ' ]',
      type: 'tax',
      amount: monthly_charges_patronales * 12
    }, {
      label: 'salaire brut [ ' + label + ' ]',
      type: 'group',
      amount: net_monthly_salary * 12
            + monthly_charges_salariales * 12,
      group: [{
        label: 'charges salariales',
        type: 'tax',
        amount: monthly_charges_salariales * 12
      }, {
        label: 'salaire net [ ' + label + ' ]',
        type: 'salary',
        amount: net_monthly_salary * 12
      }]
    }]
  };
}


const compute_amount_switch = {
  impot_societes: (structure, income) => impot_societes.compute(income).tax,
  dividend_tax: ({ status }, income) => dividend_tax[status].compute(income).tax,
  benefit_net: ({ distributeDividend }, income) => distributeDividend(income).to_dividend
}


function compute_amount(structure, income, outcome) {
  const compute = compute_amount_switch[outcome.id];
  return compute
    ? compute(structure, income)
    : income
}

const compute_outcome_switch = {
  costs: compute_costs
}

function compute_outcome(structure, income, outcome) {
  const compute = compute_outcome_switch[outcome.id];
  return compute
    ? compute(structure, income, outcome)
    : default_compute(structure, income, outcome)
}

function reduce_group(structure, income, outcome) {
  return outcome.group.reduce(function({ sum, group }, id) {
    const outcome = reduce_outcome(structure, income, Outcomes[id]);
    return {
      sum: sum + outcome.amount,
      group: [ ...group, outcome ]
    }
  }, {
    sum: 0,
    group: []
  })
}

function reduce_outcome(structure, income, outcome) {

  if (outcome.id === 'costs')
    return compute_costs(structure);

  const available_income = compute_amount(structure, income, outcome);

  if (outcome.type === 'group') {
    const { sum, group } = reduce_group(structure, available_income, outcome);

    const output = outcome.output
      ? reduce_outcome(structure, income - sum, Outcomes[outcome.output])
      : undefined;

    return {
      ...outcome,
      amount: sum + (output ? output.amount : 0),
      group,
      output
    }
  }

  return {
    ...outcome,
    amount: available_income
  }
}

export function fiscalYear(structure) {

  const {
    status,
    revenues,
    employees,
    costs,
    distributeDividend = RatioDividendDistribution(.5)
  } = structure;

  structure.distributeDividend = distributeDividend;

  const income = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);

  return reduce_outcome(structure, income, Outcomes.revenue);
}
