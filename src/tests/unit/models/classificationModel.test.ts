import { ClassificationModel } from '../../../../src/models/classificationModel';

describe('ClassificationModel', () => {
  test('should initialize with required options', () => {
    const model = new ClassificationModel({ numClasses: 3 });
    expect(model.getModelName()).toBe('UnnamedModel');
    expect(model.getNumClasses()).toBe(3);
    expect(model.getThreshold()).toBe(0.5);
  });
  
  test('should predict class labels for sample input', () => {
    const model = new ClassificationModel({ numClasses: 3 });
    const input = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    
    const predictions = model.predict(input);
    
    expect(predictions).toHaveLength(3);
    predictions.forEach(prediction => {
      expect(prediction).toBeGreaterThanOrEqual(0);
      expect(prediction).toBeLessThan(3);
    });
  });
  test('should return valid probabilities', () => {
    const model = new ClassificationModel({ numClasses: 3 });
    const input = [1, 1, 1];
    
    const probabilities = model.getProbabilities(input);
    
    expect(probabilities).toHaveLength(3);
    
    // Probabilities should sum to approximately 1
    const sum = probabilities.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
    
    // Each probability should be between 0 and 1
    probabilities.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    });
  });
  
  test('should throw error when input features length mismatches', () => {
    const model = new ClassificationModel({ numClasses: 3 });
    const input = [[1, 2]]; // Only 2 features, but model expects 3
    
    expect(() => model.predict(input)).toThrow();
  });
  
  test('should produce deterministic predictions with same seed', () => {
    const model1 = new ClassificationModel({ numClasses: 3, seed: 42 });
    const model2 = new ClassificationModel({ numClasses: 3, seed: 42 });
    
    const input = [[1, 2, 3]];
    const prediction1 = model1.predict(input);
    const prediction2 = model2.predict(input);
    
    expect(prediction1).toEqual(prediction2);
  });
});