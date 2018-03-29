const revenues = [{
  label: 'clients',
  amount: 100000
}]

const costs = [{
  label: 'consommables',
  type: 'cost',
  amount: 5000
}, {
  label: 'frais de bouche',
  type: 'cost',
  amount: 5000
}]

const employees = [{
  label: 'etn',
  gross_monthly_salary: 3750
}]

export const structure = {
  label: 'mon entreprise',
  status: 'SASU',
  revenues,
  costs,
  employees
};
