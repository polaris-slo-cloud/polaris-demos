import { customElasticityStrategies } from './custom-elasticity-strategies';

describe('customElasticityStrategies', () => {
    it('should work', () => {
        expect(customElasticityStrategies()).toEqual(
            'custom-elasticity-strategies'
        );
    });
});
