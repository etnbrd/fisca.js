import { taxes, status } from '../parser';
const Outcomes = status.sasu;

function RatioDividendDistribution(ratio) {
  return (income) => ({
    to_dividend: income * ratio,
    to_liquid: income * (1 - ratio)
  });
}

const defaults = {
  dividend_distribution: RatioDividendDistribution(1),
  ratio_salarie_retraite_compl_cadre_trC: .1
};

const {
  groupe_impot_revenu,
  groupe_impot_societes,
  groupe_charges_salariales,
  groupe_charges_patronales,
  groupe_dividende
} = taxes;



const inject_outcome = {
  default: (structure, outcome) => Outcomes[outcome.id]
}

const inject_group = {
  external_expenses: (structure, outcome) =>
  structure.costs.map(cost => ({
    id: 'expense',
    type: 'expense',
    ...cost
  })),

  salaries: (structure, outcome) =>
  structure.employees.map(employee => ({
    ...Outcomes.salary,
    context: { employee }
  })),

  default: (structure, outcome) =>
    outcome.group.map(inject_outcome.default.bind(null, structure))
}

const compute_outcome = {
  salary: (structure, income, outcome, { employee }) =>
    ({ amount: employee.gross_monthly_salary * 12 }),

  impot_societes: (structure, income) => {
    const { tax, benefits } = groupe_impot_societes.impot_societes.compute(income);
    return { amount: tax, benefits };
  },

  dividend_tax: (structure, income) => {
    const { tax, benefits } = groupe_dividende.dividende_sasu.compute(income);
    return { amount: tax, benefits };
  },

  benefit_net: ({ distribute_dividend = defaults.dividend_distribution }, income) =>
    ({ amount: distribute_dividend(income).to_dividend }),

  charges_salariales_csg: (structure, income) => {
    const { tax, benefits } = groupe_charges_salariales.csg.compute(income);
    return { amount: tax, benefits };
  },

  charges_salariales_crds: (structure, income) => {
    const { tax, benefits } = groupe_charges_salariales.crds.compute(income);
    return { amount: tax, benefits };
  },

  charges_salariales_assurance_maladie: (structure, income) => {
    const { tax, benefits } = groupe_charges_salariales.assurance_maladie.compute(income);
    return { amount: tax, benefits };
  },

  charges_salariales_assurance_vieillesse_plafond: (structure, income) => {
    const { tax, benefits } = groupe_charges_salariales.assurance_vieillesse_plafond.compute(income);
    return { amount: tax, benefits };
  },

  charges_salariales_assurance_vieillesse: (structure, income) => {
    const { tax, benefits } = groupe_charges_salariales.assurance_vieillesse.compute(income);
    return { amount: tax, benefits };
  },

  charges_salariales_assurance_chomage: (structure, income) => {
    const { tax, benefits } = groupe_charges_salariales.assurance_chomage.compute(income);
    return { amount: tax, benefits };
  },

  charges_salariales_retraite_compl_non_cadre_trA: (structure, income, outcome, { employee }) => {
    if (!employee.cadre) {
      const { tax, benefits } = groupe_charges_salariales.retraite_compl_non_cadre_trA.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_salariales_retraite_compl_non_cadre_trB: (structure, income, outcome, { employee }) => {
    if (!employee.cadre) {
      const { tax, benefits } = groupe_charges_salariales.retraite_compl_non_cadre_trB.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_salariales_retraite_compl_cadre_trA: (structure, income, outcome, { employee }) => {
    if (employee.cadre) {
      const { tax, benefits } = groupe_charges_salariales.retraite_compl_cadre_trA.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_salariales_retraite_compl_cadre_trB: (structure, income, outcome, { employee }) => {
    if (employee.cadre) {
      const { tax, benefits } = groupe_charges_salariales.retraite_compl_cadre_trB.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_salariales_retraite_compl_cadre_trC: ({
    ratio_salarie_retraite_compl_cadre_trC = defaults.ratio_salarie_retraite_compl_cadre_trC
  }, income, outcome, { employee }) => {
    if (employee.cadre) {
      const { tax, benefits } = groupe_charges_salariales.retraite_compl_cadre_trC.compute(income);
      return { amount: ratio_salarie_retraite_compl_cadre_trC * tax, benefits };
    }
    return { amount: 0 };
  },

  charges_patronales_assurance_maladie: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.assurance_maladie.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_assurance_vieillesse_plafond: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.assurance_vieillesse_plafond.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_assurance_vieillesse: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.assurance_vieillesse.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_allocations_familiales: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.allocations_familiales.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_aide_logement: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.aide_logement.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_assurance_chomage: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.assurance_chomage.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_fond_garantie_salaires: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.fond_garantie_salaires.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_retraite_compl_non_cadre_trA: (structure, income, outcome, { employee }) => {
    if (!employee.cadre) {
      const { tax, benefits } = groupe_charges_patronales.retraite_compl_non_cadre_trA.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_patronales_retraite_compl_non_cadre_trB: (structure, income, outcome, { employee }) => {
    if (!employee.cadre) {
      const { tax, benefits } = groupe_charges_patronales.retraite_compl_non_cadre_trB.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_patronales_retraite_compl_cadre_trA: (structure, income, outcome, { employee }) => {
    if (employee.cadre) {
      const { tax, benefits } = groupe_charges_patronales.retraite_compl_cadre_trA.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_patronales_retraite_compl_cadre_trB: (structure, income, outcome, { employee }) => {
    if (employee.cadre) {
      const { tax, benefits } = groupe_charges_patronales.retraite_compl_cadre_trB.compute(income);
      return { amount: tax, benefits };
    }
    return { amount: 0 };
  },

  charges_patronales_retraite_compl_cadre_trC: ({
    ratio_salarie_retraite_compl_cadre_trC = defaults.ratio_salarie_retraite_compl_cadre_trC
  }, income, outcome, { employee }) => {
    if (employee.cadre) {
      const { tax, benefits } = groupe_charges_patronales.retraite_compl_cadre_trC.compute(income);
      return { amount: (1 - ratio_salarie_retraite_compl_cadre_trC) * tax , benefits };
    }
      return { amount: 0 };
  },

  charges_patronales_assurace_deces: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.assurace_deces.compute(income);
    return { amount: tax, benefits };
  },

  charges_patronales_formation_professionnelle: (structure, income) => {
    const { tax, benefits } = groupe_charges_patronales.formation_professionnelle.compute(income);
    return { amount: tax, benefits };
  }
}

export default {
  status: 'sasu',
  inject_outcome,
  inject_group,
  compute_outcome
}
