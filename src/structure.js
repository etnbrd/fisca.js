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

export const structure = {
  label: 'mon entreprise',
  status: 'sasu',
  revenues,
  costs,
  employees
};
