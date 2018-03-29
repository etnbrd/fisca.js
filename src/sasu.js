export const revenue = {
  label: `Chiffre d'affaire`,
  id: 'revenue',
  type: 'group',
  group: [ 'costs' ],
  output: 'result'
}

export const costs = {
  label: 'Coûts',
  id: 'costs',
  type: 'group'
}

export const result = {
  label: 'Résultat',
  id: 'result',
  type: 'group',
  group: [ 'taxes' ],
  output: 'benefit'
}

export const taxes = {
  label: 'Impôts',
  id: 'taxes',
  type: 'group',
  group: [ 'impot_societes' ]
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
  group: [ 'dividend' ],
  output: 'treso'
}

export const dividend = {
  label: 'Dividendes',
  id: 'dividend',
  type: 'group',
  group:  [ 'dividend_tax' ],
  output: 'dividend_net'
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
