import { BaseModel, ModelOptions } from './baseModel';

export interface ClassificationModelOptions extends ModelOptions {
  numClasses: number;
  threshold?: number;
}

export class ClassificationModel extends BaseModel {
  private readonly numClasses: number;
  private readonly weights: number[][];
  private readonly threshold: number;
  
  constructor(options: ClassificationModelOptions) {
    super(options);
    this.numClasses = options.numClasses;
    this.threshold = options.threshold || 0.5;
    
    // Her sınıf için ağırlıklar oluştur (örnek olarak 3 özellik kullanıyoruz)
    this.weights = Array(this.numClasses).fill(0).map((_, i) => {
      return [0.1 * i, 0.2 * i, 0.3 * i]; // Örnek ağırlıklar
    });
  }
  
  predict(input: number[][]): number[] {
    return input.map(features => this.predictSingle(features));
  }
  
  predictSingle(features: number[]): number {
    if (features.length !== this.weights[0].length) {
      throw new Error(`Input features length (${features.length}) does not match model weights length (${this.weights[0].length})`);
    }
    
    // Her sınıf için bir skor hesapla
    const scores = this.weights.map((classWeights, classIndex) => {
      let score = 0;
      for (let i = 0; i < features.length; i++) {
        score += classWeights[i] * features[i];
      }
      
      // Eğer seed tanımlıysa, deterministik gürültü ekle
      if (this.seed !== undefined) {
        score += (this.generatePseudoRandom(this.seed + classIndex + features.reduce((a, b) => a + b, 0)) - 0.5) * 0.1;
      }
      
      return score;
    });
    
    // En yüksek skora sahip sınıfı döndür
    let maxScore = scores[0];
    let predictedClass = 0;
    
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        predictedClass = i;
      }
    }
    
    return predictedClass;
  }
  
  getProbabilities(features: number[]): number[] {
    if (features.length !== this.weights[0].length) {
      throw new Error(`Input features length (${features.length}) does not match model weights length (${this.weights[0].length})`);
    }
    
    // Her sınıf için bir skor hesapla
    const scores = this.weights.map((classWeights, classIndex) => {
      let score = 0;
      for (let i = 0; i < features.length; i++) {
        score += classWeights[i] * features[i];
      }
      
      // Eğer seed tanımlıysa, deterministik gürültü ekle
      if (this.seed !== undefined) {
        score += (this.generatePseudoRandom(this.seed + classIndex + features.reduce((a, b) => a + b, 0)) - 0.5) * 0.1;
      }
      
      return Math.exp(score); // e^score değerini hesapla (softmax için)
    });
    
    // Softmax: olasılıkları normalize et
    const sum = scores.reduce((a, b) => a + b, 0);
    return scores.map(score => score / sum);
  }
  
  getNumClasses(): number {
    return this.numClasses;
  }
  
  getThreshold(): number {
    return this.threshold;
  }
}