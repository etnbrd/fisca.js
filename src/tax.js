// This defines the behavior of a regressive tax.
// Each bracket, with a floor and a ceiling, defines a specific rate to apply.
// The tax is calculated by applying the rate of each bracket to the
// corresponding slice in the income.

const default_bracket = { floor: 0, ceil: Infinity, rate: 1 };

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

function fillCeil(brackets) {
  // From the biggest bracket, cascade the floor of a superior bracket
  // into the ceil of the next inferior.

  return brackets
    .sort((a, b) => b.floor - a.floor)
    .reduce((brackets, inferior) => {
      const superior = brackets[0];
      inferior.ceil = superior ? superior.floor : Infinity;
      return [ inferior, ...brackets ];
    }, []);
}


function mergeBrackets(a, b) {

  const result = [];

  for (
    var ba = a.shift(),
        bb = b.shift(),
        floor = Math.min(ba.floor, bb.floor);
        ;
  ) {

    const ceil = Math.min(ba.ceil, bb.ceil);

    result.push({
      floor,
      ceil,
      rate: ba.rate * bb.rate
    })

    floor = ceil;

    if (a.length === 0 && b.length === 0)
      break;

    if (ba.ceil === ceil)
      ba = a.shift() || default_bracket;
    if (bb.ceil === ceil)
      bb = b.shift() || default_bracket;
  }

  return result;
}


export default class Tax {


  constructor(structure) {
    const { brackets = [default_bracket], base = [default_bracket] } = structure;

    this.brackets = mergeBrackets(
      fillCeil(brackets),
      fillCeil(base)
    ).map(bracket => new Bracket(bracket));
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
