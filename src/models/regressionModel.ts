import { BaseModel, ModelOptions } from './baseModel';

export interface RegressionModelOptions extends ModelOptions {
  learningRate?: number;
  iterations?: number;
}

export class RegressionModel extends BaseModel {
  private readonly weights: number[];
  private bias: number;
  private readonly learningRate: number;
  private readonly iterations: number;

  constructor(options: RegressionModelOptions = {}) {
    super(options);
    this.learningRate = options.learningRate || 0.01;
    this.iterations = options.iterations || 1000;
    
    // İlk ağırlıkları rastgele oluştur
    this.weights = [0.5, 0.5, 0.5]; // Örnek olarak 3 özellik için
    this.bias = 0.1;
  }
  
  train(features: number[][], labels: number[]): void {
    // Basit bir lineer regresyon eğitimi simülasyonu
    for (let iter = 0; iter < this.iterations; iter++) {
      for (let i = 0; i < features.length; i++) {
        const prediction = this.predictSingle(features[i]);
        const error = prediction - labels[i];
        
        // Ağırlıkları ve bias'ı güncelle
        for (let j = 0; j < this.weights.length; j++) {
          this.weights[j] -= this.learningRate * error * features[i][j];
        }
        // Bias güncelleme
        this.bias -= this.learningRate * error;
      }
    }
  }

  predict(input: number[][]): number[] {
    return input.map(features => this.predictSingle(features));
  }
  
  predictSingle(features: number[]): number {
    if (features.length !== this.weights.length) {
      throw new Error(`Input features length (${features.length}) does not match model weights length (${this.weights.length})`);
    }
    
    // Lineer regresyon hesaplaması: y = w1*x1 + w2*x2 + ... + wn*xn + b
    let result = this.bias;
    for (let i = 0; i < features.length; i++) {
      result += this.weights[i] * features[i];
    }
    
    // Eğer seed tanımlıysa, deterministik gürültü ekle
    if (this.seed !== undefined) {
      result += (this.generatePseudoRandom(this.seed + features.reduce((a, b) => a + b, 0)) - 0.5) * 0.1;
    }
    
    return result;
  }
  
  getWeights(): number[] {
    return [...this.weights];
  }
  
  getBias(): number {
    return this.bias;
  }
}