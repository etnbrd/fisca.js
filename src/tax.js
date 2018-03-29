// This defines the behavior of a regressive tax.
// Each bracket, with a floor and a ceiling, defines a specific rate to apply.
// The tax is calculated by applying the rate of each bracket to the
// corresponding slice in the income.

class Bracket {

  constructor({ floor, rate, ceil }) {
    this.floor = floor;
    this.rate = rate;
    this.ceil = ceil;
  }

  compute(income) {

    const taxable = Math.max(Math.min(income - this.floor, this.ceil), 0);
    const tax = taxable * this.rate;
    const outcome = income - tax;

    return { tax, outcome }
  }

}



export default class Tax {


  constructor(brackets) {
    // From the biggest bracket, cascade the floor of a superior bracket
    // into the ceil of the next inferior.
    this.brackets = brackets
      .sort((a, b) => b.floor - a.floor)
      .reduce((brackets, inferior) => {

        const superior = brackets[0];

        inferior.ceil = superior ? superior.floor : Infinity;

        return [ new Bracket(inferior), ...brackets ];
      }, []);
  }


  compute(income) {
    // Calculate the tax for each bracket of income,
    // and accumulate these taxes, while reducing the income accordingly.
    return this.brackets.reduce((result, bracket) => {
      const { outcome, tax } = bracket.compute(result.outcome);

      return {
        outcome,
        tax: result.tax + tax,
        taxes: [
          ...result.taxes,
          { tax, bracket }
        ]
      }
    }, {
      outcome: income,
      tax: 0,
      taxes: []
    })
  }
}
