import { AIModel } from "../aiModel";


describe('AI Model Tests', () => {
  test('should return correct prediction for basic input', () => {
    const model = new AIModel();
    const result = model.predict([1, 2, 3, 4, 5]);
    expect(result).toBe(3);
  });

  test('should handle empty input array', () => {
    const model = new AIModel();
    const result = model.predict([]);
    expect(result).toBe(0);
  });

  test('confidence score should be between 0 and 1', () => {
    const model = new AIModel();
    const confidence = model.getConfidence();
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(1);
  });
  
  test('model should be deterministic with fixed seed', () => {
    const model1 = new AIModel({ seed: 42 });
    const model2 = new AIModel({ seed: 42 });
    
    const result1 = model1.predict([1, 2, 3]);
    const result2 = model2.predict([1, 2, 3]);
    
    // Aynı tohum değeri ile sonuçlar eşleşmeli
    expect(result1).toEqual(result2);
  });
  
  test('different seeds should produce different results', () => {
    const model1 = new AIModel({ seed: 42 });
    const model2 = new AIModel({ seed: 43 });
    
    const result1 = model1.predict([1, 2, 3]);
    const result2 = model2.predict([1, 2, 3]);
    
    // Farklı tohum değerleri ile sonuçlar farklı olmalı
    expect(result1).not.toEqual(result2);
  });
});