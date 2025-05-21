// src/utils/featureImportance.ts
import { BaseModel } from '../models/baseModel';
import { Metrics } from './metrics';

export interface FeatureImportance {
  feature: number;
  importance: number;
}

export class FeatureImportanceAnalyzer {
  // Permutation feature importance hesaplanması
  static calculatePermutationImportance(
    model: BaseModel, 
    features: number[][], 
    labels: number[], 
    isClassification = false,
    numRepeats = 5
  ): FeatureImportance[] {
    const numFeatures = features[0].length;
    const basePerformance = isClassification 
      ? Metrics.accuracy(labels, model.predict(features) as number[])
      : -Metrics.meanSquaredError(labels, model.predict(features) as number[]);
    
    const importances: FeatureImportance[] = [];
    
    for (let featureIdx = 0; featureIdx < numFeatures; featureIdx++) {
      let importanceSum = 0;
      
      for (let repeat = 0; repeat < numRepeats; repeat++) {
        // Veri kopyasını oluştur
        const permutedFeatures = features.map(row => [...row]);
        
        // Özelliği karıştır
        this.shuffleFeature(permutedFeatures, featureIdx);
        
        // Karıştırılmış verilerle performansı ölç
        const permutedPerformance = isClassification 
          ? Metrics.accuracy(labels, model.predict(permutedFeatures) as number[])
          : -Metrics.meanSquaredError(labels, model.predict(permutedFeatures) as number[]);
        
        // Önem: temel performans - karıştırılmış performans
        importanceSum += (basePerformance - permutedPerformance);
      }
      
      // Ortalama önem
      importances.push({
        feature: featureIdx,
        importance: importanceSum / numRepeats
      });
    }
    
    // Önem sırasına göre sırala
    return importances.sort((a, b) => b.importance - a.importance);
  }
  
  private static shuffleFeature(features: number[][], featureIdx: number): void {
    // Fisher-Yates shuffle algoritması ile belirli bir özelliği karıştır
    const values = features.map(row => row[featureIdx]);
    
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    
    // Karıştırılmış değerleri geri yaz
    for (let i = 0; i < features.length; i++) {
      features[i][featureIdx] = values[i];
    }
  }
}

