import { taxes, status } from '../parser';
const Outcomes = status.me;


const {
  groupe_me
} = taxes;


const inject_outcome = {
  default: (structure, outcome) => Outcomes[outcome.id]
}

const inject_group = {
  default: (structure, outcome) =>
    outcome.group.map(inject_outcome.default.bind(null, structure))
}

const compute_amount = {

  cfe: (structure, income) =>
    0, // TODO

  cipav: (structure, income) =>
    groupe_me.cipav.compute(income).tax,

  cfp: (structure, income) =>
    groupe_me.formation_professionnelle.compute(income).tax
}

export default {
  status: 'me',
  inject_outcome,
  inject_group,
  compute_amount
}
