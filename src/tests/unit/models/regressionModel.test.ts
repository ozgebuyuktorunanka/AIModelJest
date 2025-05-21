import { RegressionModel } from '../../../../src/models/regressionModel';

describe('RegressionModel', () => {
  test('should initialize with default options', () => {
    const model = new RegressionModel();
    expect(model.getModelName()).toBe('UnnamedModel');
    expect(model.getWeights()).toHaveLength(3);
    expect(model.getBias()).toBeDefined();
  });
  
  test('should predict correctly for sample input', () => {
    const model = new RegressionModel();
    const input = [[1, 2, 3]];
    const prediction = model.predict(input);
    
    expect(prediction).toHaveLength(1);
    expect(typeof prediction[0]).toBe('number');
  });
  test('should train and improve predictions', () => {
    const model = new RegressionModel({ iterations: 100 });
    
    // Simple training data: y = 2*x1 + 3*x2 + 1*x3 + 5
    const features = [
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
      [4, 4, 4]
    ];
    
    const labels = [
      2*1 + 3*1 + 1*1 + 5,
      2*2 + 3*2 + 1*2 + 5,
      2*3 + 3*3 + 1*3 + 5,
      2*4 + 3*4 + 1*4 + 5
    ];
    
    // Calculate error before training
    const predictionsBefore = model.predict(features);
    let errorBefore = 0;
    for (let i = 0; i < labels.length; i++) {
      errorBefore += Math.abs(labels[i] - predictionsBefore[i]);
    }
    
    // Train the model
    model.train(features, labels);
    // Calculate error after training
    const predictionsAfter = model.predict(features);
    let errorAfter = 0;
    for (let i = 0; i < labels.length; i++) {
      errorAfter += Math.abs(labels[i] - predictionsAfter[i]);
    }
    
    // Error should decrease after training
    expect(errorAfter).toBeLessThan(errorBefore);
  });
  
  test('should throw error when input features length mismatches weights', () => {
    const model = new RegressionModel();
    const input = [[1, 2]]; // Only 2 features, but model expects 3
    
    expect(() => model.predict(input)).toThrow();
  });
  
  test('should produce deterministic predictions with same seed', () => {
    const model1 = new RegressionModel({ seed: 42 });
    const model2 = new RegressionModel({ seed: 42 });
    
    const input = [[1, 2, 3]];
    const prediction1 = model1.predict(input);
    const prediction2 = model2.predict(input);
    
    expect(prediction1).toEqual(prediction2);
  });
});