import { BaseModel, ModelOptions } from '../../../../src/models/baseModel';

class TestModel extends BaseModel {
    constructor(options: ModelOptions = {}) {
      super(options);
    }
    
    predict(input: number[]): number {
      return input.reduce((sum, val) => sum + val, 0);
    }
  }
  describe('BaseModel', () => {
    test('should initialize with default options', () => {
      const model = new TestModel();
      expect(model.getModelName()).toBe('UnnamedModel');
    });
    
    test('should initialize with custom name', () => {
      const model = new TestModel({ name: 'CustomModel' });
      expect(model.getModelName()).toBe('CustomModel');
    });
    
    test('should return confidence score between 0 and 1', () => {
      const model = new TestModel();
      const confidence = model.getConfidence();
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });
    test('should generate deterministic confidence with seed', () => {
        const model1 = new TestModel({ seed: 42 });
        const model2 = new TestModel({ seed: 42 });
        
        const confidence1 = model1.getConfidence();
        const confidence2 = model2.getConfidence();
        
        expect(confidence1).toBe(confidence2);
      });
      
      test('should generate different confidence with different seeds', () => {
        const model1 = new TestModel({ seed: 42 });
        const model2 = new TestModel({ seed: 43 });
        
        const confidence1 = model1.getConfidence();
        const confidence2 = model2.getConfidence();
        
        expect(confidence1).not.toBe(confidence2);
      });
    });