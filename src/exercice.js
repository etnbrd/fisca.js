import status from './status';

function inject_outcome(structure, outcome) {
  return (
    structure.inject_outcome[outcome.id] ||
    structure.inject_outcome.default
  )(structure, outcome);
}

function inject_group(structure, outcome) {
  return (
    structure.inject_group[outcome.id] ||
    structure.inject_group.default
  )(structure, outcome);
}

function compute_amount(structure, income, outcome, context) {
  if (outcome.amount) return outcome.amount;
  const compute = structure.compute_amount[outcome.id];
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
      const pre_output = inject_outcome(structure, outcome.output);
      const output = reduce_outcome(structure, income - sum, pre_output, context);

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
    revenues,
    root = 'revenue'
  } = structure;

  const income = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);

  const working_structure = {
    ...structure,
    ...status[structure.status]
  }

  return reduce_outcome(working_structure, income, inject_outcome(working_structure, { id: root }));
}
