import { Metrics } from '../../../../src/utils/metrics';

describe('Metrics', () => {
    describe('Regression Metrics', () => {
        test('should calculate mean squared error correctly', () => {
            const actual = [1, 2, 3, 4, 5];
            const predicted = [1, 3, 2, 5, 4];

            const mse = Metrics.meanSquaredError(actual, predicted);
            // (0² + 1² + 1² + 1² + 1²) / 5 = 0.8
            expect(mse).toBe(0.8);
        });

        test('should calculate root mean squared error correctly', () => {
            const actual = [1, 2, 3, 4, 5];
            const predicted = [1, 3, 2, 5, 4];

            const rmse = Metrics.rootMeanSquaredError(actual, predicted);
            // √0.8 ≈ 0.8944
            expect(rmse).toBeCloseTo(0.8944, 4);
        });

        test('should calculate mean absolute error correctly', () => {
            const actual = [1, 2, 3, 4, 5];
            const predicted = [1, 3, 2, 5, 4];

            const mae = Metrics.meanAbsoluteError(actual, predicted);
            // (0 + 1 + 1 + 1 + 1) / 5 = 0.8
            expect(mae).toBe(0.8);
        });

        test('should calculate r2 score correctly', () => {
            const actual = [1, 2, 3, 4, 5];
            const predicted = [1, 3, 2, 5, 4];

            const r2 = Metrics.r2Score(actual, predicted);
            expect(r2).toBeLessThanOrEqual(1);
        });

        test('should throw error when arrays have different lengths', () => {
            const actual = [1, 2, 3, 4, 5];
            const predicted = [1, 2, 3, 4];

            expect(() => Metrics.meanSquaredError(actual, predicted)).toThrow();
        });
    });

    describe('Classification Metrics', () => {
        test('should calculate accuracy correctly', () => {
            const actual = [0, 1, 0, 1, 0];
            const predicted = [0, 1, 1, 1, 0];
    
            const accuracy = Metrics.accuracy(actual, predicted);
            // 4 / 5 = 0.8
            expect(accuracy).toBe(0.8);
        });
    });
});

