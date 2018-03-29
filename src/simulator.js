import { fiscalYear } from './exercice';

function* situationsIterator(variables) {

  // Instead of computing all the variables combination,
  // this algorithm computes the divisors to transform an iteration index into
  // the indexes of the set of variables.
  // Also the last divisor computed (the first in the result) is the total number of iterations
  const [ total, ...divisors ] = variables
    .reduceRight((divisors, { values }) => [
        divisors[0] * values.length,
        ...divisors
      ], [ 1 ]);

  function getPermutation(n) {
    return variables.reduce((situation, { values, ...variable }, i) => [
        ...situation,
        {
          ...variable,
          value: values[Math.floor(n / divisors[i]) % values.length]
        }
      ], []);
  }

  let index = 0;
  while(index < total)
    yield getPermutation(index++);
}



function applySituation(structure, situation) {
  return situation.reduce((structure, variable) =>
    variable.inject(structure),
    structure);
}


function simplifyStructure(structure) {
  return {
    ...structure,
    revenues: structure.revenues.reduce((sum, revenue) => sum + revenue.amount, 0),
    costs: structure.costs.reduce((sum, cost) => sum + cost.amount, 0)
  }
}



export default function simulator(structure, variables, output) {

  console.log('-- Simulation for [ ' + variables.map(v => v.id).join(', ') + ' ]' );

  const situations = Array.from(situationsIterator(variables));

  const simulations = situations.reduce((accu, situation) => {
      const result = fiscalYear(simplifyStructure(applySituation(structure, situation)));

      return [
        ...accu,
        {
          result,
          situation
        }
      ]
    }, [])

  console.log('-- Simulation result ', simulations);

  const result = {
    maximize: output.maximize.map(({ id, get }) => {
      return {
        id,
        ...simulations.reduce((max, simulation) => {
          const value = get(simulation.result);
          return value >= max.value
            ? { value, simulation }
            : max;
        }, {
          value: -Infinity,
        })
      }
    }),

    compare: output.compare.map(({ id, get }) => {
      return {
        id,
        simulations: simulations.reduce((accu, { result, situation }) => {
          const value = get(result);
          return [
            ...accu,
            {
              value,
              result,
              situation
            }
          ]
        }, [])
      }
    })

  }

  return result;
}


export function filterByVariable(results, variables) {
  
}
