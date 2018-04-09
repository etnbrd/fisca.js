import taxes from '../../taxes';
import Outcomes from './tree.json';


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

const compute_outcome = {

  cfe: (structure, income) => {
    return { amount: 0 } // TODO
  },

  cipav: (structure, income) => {
    const { tax: amount, benefits } = groupe_me.cipav.compute(income);
    return { amount, benefits };
  },

  cfp: (structure, income) => {
    const { tax: amount, benefits } = groupe_me.formation_professionnelle.compute(income);
    return { amount, benefits };
  }
}

export default {
  status: 'me',
  inject_outcome,
  inject_group,
  compute_outcome
}
