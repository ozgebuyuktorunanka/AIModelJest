import { DataProcessor } from '../../../../src/utils/dataProcessor';

describe('DataProcessor', () => {
  test('should initialize with default options', () => {
    const processor = new DataProcessor();
    expect(processor).toBeDefined();
  });
  
  test('should fit and calculate statistics correctly', () => {
    const processor = new DataProcessor();
    const data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    processor.fit(data);
    
    const means = processor.getMeans();
    const mins = processor.getMins();
    const maxs = processor.getMaxs();
    
    expect(means).toHaveLength(3);
    expect(mins).toHaveLength(3);
    expect(maxs).toHaveLength(3);
    
    // Ortalama kontrol
    expect(means[0]).toBe((1 + 4 + 7) / 3);
    expect(means[1]).toBe((2 + 5 + 8) / 3);
    expect(means[2]).toBe((3 + 6 + 9) / 3);
    
    // Min/max kontrol
    expect(mins[0]).toBe(1);
    expect(maxs[0]).toBe(7);
  });
  
  test('should transform data with standardization', () => {
    const processor = new DataProcessor({ standardize: true });
    const data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    processor.fit(data);
    const transformed = processor.transform(data);
    
    expect(transformed).toHaveLength(3);
    expect(transformed[0]).toHaveLength(3);
    
    // İlk özelliğin ortalaması 4, standart sapması ~2.45
    // Standardize edilmiş değerler yaklaşık: -1.22, 0, 1.22
    expect(transformed[0][0]).toBeCloseTo(-1.22, 1);
    expect(transformed[1][0]).toBeCloseTo(0, 1);
    expect(transformed[2][0]).toBeCloseTo(1.22, 1);
  });
  test('should transform data with normalization', () => {
    const processor = new DataProcessor({ normalize: true });
    const data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    
    processor.fit(data);
    const transformed = processor.transform(data);
    
    expect(transformed).toHaveLength(3);
    
    // İlk özellik 1-7 aralığında, normalize edilmiş değerler: 0, 0.5, 1
    expect(transformed[0][0]).toBe(0);
    expect(transformed[1][0]).toBe(0.5);
    expect(transformed[2][0]).toBe(1);
  });
  
  test('should handle missing values', () => {
    const processor = new DataProcessor({ fillMissing: true, fillValue: -1 });
    const data = [
      [1, 2, 3],
      [4, NaN, 6],
      [7, 8, 9]
    ];
    
    processor.fit(data);
    const transformed = processor.transform(data);
    
    expect(transformed).toHaveLength(3);
    expect(transformed[1][1]).toBe(-1); // NaN değeri -1 ile doldurulmalı
  });
  test('should throw error when fitting on empty dataset', () => {
    const processor = new DataProcessor();
    expect(() => processor.fit([])).toThrow();
  });
  
  test('should throw error when transforming before fitting', () => {
    const processor = new DataProcessor();
    const data = [[1, 2, 3]];
    expect(() => processor.transform(data)).toThrow();
  });
});