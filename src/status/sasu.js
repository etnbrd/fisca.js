import { taxes, status } from '../parser';
const Outcomes = status.sasu;

function RatioDividendDistribution(ratio) {
  return (income) => ({
    to_dividend: income * ratio,
    to_liquid: income * (1 - ratio)
  });
}

const defaultDividendDistribution = RatioDividendDistribution(1);

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

const compute_amount = {
  salary: (structure, income, outcome, { employee }) =>
    employee.gross_monthly_salary * 12,

  impot_societes: (structure, income) =>
    groupe_impot_societes.impot_societes.compute(income).tax,

  dividend_tax: (structure, income) =>
     groupe_dividende.dividende_sasu.compute(income).tax,

  benefit_net: ({ distributeDividend = defaultDividendDistribution }, income) =>
    distributeDividend(income).to_dividend,

  charges_salariales_csg: (structure, income) =>
    groupe_charges_salariales.csg.compute(income).tax,

  charges_salariales_crds: (structure, income) =>
    groupe_charges_salariales.crds.compute(income).tax,

  charges_salariales_assurance_maladie: (structure, income) =>
    groupe_charges_salariales.assurance_maladie.compute(income).tax,

  charges_salariales_assurance_vieillesse_plafond: (structure, income) =>
    groupe_charges_salariales.assurance_vieillesse_plafond.compute(income).tax,

  charges_salariales_assurance_vieillesse: (structure, income) =>
    groupe_charges_salariales.assurance_vieillesse.compute(income).tax,

  charges_salariales_assurance_chomage: (structure, income) =>
    groupe_charges_salariales.assurance_chomage.compute(income).tax,

  charges_salariales_retraite_compl_non_cadre_trA: (structure, income) =>
    groupe_charges_salariales.retraite_compl_non_cadre_trA.compute(income).tax,

  charges_salariales_retraite_compl_non_cadre_trB: (structure, income) =>
    groupe_charges_salariales.retraite_compl_non_cadre_trB.compute(income).tax,

  charges_salariales_retraite_compl_cadre_trA: (structure, income) =>
    groupe_charges_salariales.retraite_compl_cadre_trA.compute(income).tax,

  charges_salariales_retraite_compl_cadre_trB: (structure, income) =>
    groupe_charges_salariales.retraite_compl_cadre_trB.compute(income).tax,

  charges_salariales_retraite_compl_cadre_trC: (structure, income) =>
    groupe_charges_salariales.retraite_compl_cadre_trC.compute(income).tax,

  charges_patronales_assurance_maladie: (structure, income) =>
    groupe_charges_patronales.assurance_maladie.compute(income).tax,

  charges_patronales_assurance_vieillesse_plafond: (structure, income) =>
    groupe_charges_patronales.assurance_vieillesse_plafond.compute(income).tax,

  charges_patronales_assurance_vieillesse: (structure, income) =>
    groupe_charges_patronales.assurance_vieillesse.compute(income).tax,

  charges_patronales_allocations_familiales: (structure, income) =>
    groupe_charges_patronales.allocations_familiales.compute(income).tax,

  charges_patronales_aide_logement: (structure, income) =>
    groupe_charges_patronales.aide_logement.compute(income).tax,

  charges_patronales_assurance_chomage: (structure, income) =>
    groupe_charges_patronales.assurance_chomage.compute(income).tax,

  charges_patronales_fond_garantie_salaires: (structure, income) =>
    groupe_charges_patronales.fond_garantie_salaires.compute(income).tax,

  charges_patronales_retraite_compl_non_cadre_trA: (structure, income) =>
    groupe_charges_patronales.retraite_compl_non_cadre_trA.compute(income).tax,

  charges_patronales_retraite_compl_non_cadre_trB: (structure, income) =>
    groupe_charges_patronales.retraite_compl_non_cadre_trB.compute(income).tax,

  charges_patronales_retraite_compl_cadre_trA: (structure, income) =>
    groupe_charges_patronales.retraite_compl_cadre_trA.compute(income).tax,

  charges_patronales_retraite_compl_cadre_trB: (structure, income) =>
    groupe_charges_patronales.retraite_compl_cadre_trB.compute(income).tax,

  charges_patronales_retraite_compl_cadre_trC: (structure, income) =>
    groupe_charges_patronales.retraite_compl_cadre_trC.compute(income).tax,

  charges_patronales_assurace_deces: (structure, income) =>
    groupe_charges_patronales.assurace_deces.compute(income).tax,

  charges_patronales_formation_professionnelle: (structure, income) =>
    groupe_charges_patronales.formation_professionnelle.compute(income).tax
}

export default {
  status: 'sasu',
  inject_outcome,
  inject_group,
  compute_amount
}
