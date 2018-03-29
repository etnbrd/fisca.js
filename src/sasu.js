export const revenue = {
  label: `Chiffre d'affaire`,
  id: 'revenue',
  type: 'group',
  group: [{
    id: 'expenses'
  }],
  output: {
    id: 'result'
  }
}

export const expenses = {
  label: 'Charges',
  id: 'expenses',
  type: 'group',
  group: [{
    id: 'external_expenses'
  }, {
    id: 'internal_expenses'
  }]
}

export const external_expenses = {
  label: 'Charges externes',
  id: 'external_expenses',
  type: 'group'
}

export const internal_expenses = {
  label: 'Charges internes',
  id: 'internal_expenses',
  type: 'group',
  group: [{
    id: 'salaries'
  }]
}

export const salaries = {
  label: 'Salaires',
  id: 'salaries',
  type: 'group',
  group: [{
    id: 'salary'
  }]
}

export const salary = {
  label: 'Salaire',
  id: 'salary',
  type: 'group',
  group: [{
    id: 'charges_patronales'
  }, {
    id: 'gross_salary'
  }]
}

export const charges_patronales = {
  label: 'Charges patronale',
  id: 'charges_patronales',
  type: 'tax',
}

export const gross_salary = {
  label: 'Salaire brut',
  id: 'gross_salary',
  type: 'group',
  group: [{
    id: 'charges_salariales'
  }],
  output: {
    id: 'net_salary'
  }
}

export const charges_salariales = {
  label: 'Charges salariales',
  id: 'charges_salariales',
  type: 'tax'
}

export const net_salary = {
  label: 'Salaire net',
  id: 'net_salary',
  type: 'salary'
}

export const result = {
  label: 'Résultat',
  id: 'result',
  type: 'group',
  group: [{
    id: 'taxes'
  }],
  output: {
    id: 'benefit'
  }
}

export const taxes = {
  label: 'Impôts',
  id: 'taxes',
  type: 'group',
  group: [{
    id: 'impot_societes'
  }]
}

export const impot_societes = {
  label: 'Impôt sur les sociétés',
  id: 'impot_societes',
  type: 'tax'
}

export const benefit = {
  label: 'Bénéfice net',
  id: 'benefit_net',
  type: 'group',
  group: [{
    id: 'dividend'
  }],
  output: {
    id: 'treso'
  }
}

export const dividend = {
  label: 'Dividendes',
  id: 'dividend',
  type: 'group',
  group:  [{
    id: 'dividend_tax'
  }],
  output: {
    id: 'dividend_net'
  }
}

export const dividend_tax = {
  label: 'taxes',
  id: 'dividend_tax',
  type: 'tax',
}

export const dividend_net = {
  label: 'dividendes net',
  id: 'dividend_net',
  type: 'dividend'
}

export const treso = {
  label: 'Trésorerie',
  id: 'treso',
  type: 'benefit'
}
