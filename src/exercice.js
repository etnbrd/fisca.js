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

/* TODO
  These two switches are specific and belongs to the SASU status.
 */

const inject_group_switch = {
  external_expenses: (structure, outcome) => structure.costs.map(cost => ({
    id: 'expense',
    type: 'expense',
    ...cost
  })),

  salaries: (structure, outcome) => structure.employees.map(employee => ({
    ...Outcomes.salary,
    context: { employee }
  })),

  default: (structure, outcome) =>  outcome.group.map(({ id, context }) => ({
    ...Outcomes[id],
    context
  }))
}

const compute_amount_switch = {
  salary: (structure, income, outcome, { employee }) => employee.gross_monthly_salary * 12,
  charges_patronales: (structure, income) => charges_patronales.compute(income).tax,
  charges_salariales: (structure, income) => charges_salariales.compute(income).tax,
  impot_societes: (structure, income) => impot_societes.compute(income).tax,
  dividend_tax: ({ status }, income) => dividend_tax[status].compute(income).tax,
  benefit_net: ({ distributeDividend }, income) => distributeDividend(income).to_dividend
}



function inject_group(structure, outcome) {
  return (inject_group_switch[outcome.id] || inject_group_switch.default)(structure, outcome);
}

function compute_amount(structure, income, outcome, context) {
  if (outcome.amount) return outcome.amount;
  const compute = compute_amount_switch[outcome.id];
  return compute
    ? compute(structure, income, outcome, context)
    : income
}

function reduce_group(structure, income, outcome, parent_context) {

  return inject_group(structure, outcome)
    .reduce(function({ sum, group }, outcome) {
      const child = reduce_outcome(structure, income, outcome, outcome.context);
      return {
        sum: sum + child.amount,
        group: [ ...group, child ]
      }
    }, {
      sum: 0,
      group: []
    })
}

function reduce_outcome(structure, income, outcome, context) {

  const available_income = compute_amount(structure, income, outcome, context);

  if (outcome.type === 'group') {
    const { sum, group } = reduce_group(structure, available_income, outcome, context);

    if (outcome.output) {
      const { id } = outcome.output;
      const output = reduce_outcome(structure, income - sum, Outcomes[id], context);

      return {
        amount: sum + output.amount,
        ...outcome,
        group,
        output
      }
    }

    return {
      amount: sum,
      ...outcome,
      group
    }
  }

  return {
    amount: available_income,
    ...outcome
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
