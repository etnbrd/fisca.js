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

function compute_outcome(structure, income, outcome, context) {
  if (outcome.amount) return outcome.amount;
  const compute = structure.compute_outcome[outcome.id];
  return compute
    ? compute(structure, income, outcome, context)
    : { amount: income }
}

function reduce_group(structure, income, outcome, parent_context) {

  return inject_group(structure, outcome)
    .reduce(function({ sum, group }, child) {
      const { context: child_context, ...pre_outcome } = child;
      const context = { ...parent_context, ...child_context };
      const outcome = reduce_outcome(structure, income, pre_outcome, context);
      return {
        sum: sum + outcome.amount,
        group: [ ...group, outcome ]
      }
    }, {
      sum: 0,
      group: []
    })
}

function reduce_outcome(structure, income, outcome, context) {

  const {
    amount: available_income,
    benefits
  } = compute_outcome(structure, income, outcome, context);

  if (outcome.type === 'group') {
    const { sum, group } = reduce_group(structure, available_income, outcome, context);

    if (outcome.output) {
      const pre_output = inject_outcome(structure, outcome.output);
      const output = reduce_outcome(structure, income - sum, pre_output, context);

      return {
        amount: sum + output.amount,
        benefits,
        ...outcome,
        group,
        output
      }
    }

    return {
      amount: sum,
      benefits,
      ...outcome,
      group
    }
  }

  return {
    amount: available_income,
    benefits,
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
