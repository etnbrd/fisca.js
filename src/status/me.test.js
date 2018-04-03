import { fiscalYear } from '../exercice';

function structure_ME(income) {
  return {
    label: 'ma Micro-Entreprise',
    status: 'me',
    revenues: [{
      label: 'clients',
      amount: income
    }]
  };
}

describe('Micro-entreprise', function() {

  function testWithIncome(income) {
    return function() {
      // GIVEN
      const structure = structure_ME(income);
      const result = fiscalYear(structure);

      // THEN
      it('should match the expected benefit', function() {
        expect(result.output.amount).toEqual(income * (1 - 0.222))
      })
    }
  }

  describe('Revenue nulle', testWithIncome(0));
  // 3 points to verify the linearity of the result
  describe('Revenue 10K', testWithIncome(10000));
  describe('Revenue 20K', testWithIncome(20000));
  describe('Revenue 30K', testWithIncome(30000));
});
