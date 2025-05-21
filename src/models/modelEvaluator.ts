import { BaseModel } from '../models/baseModel';
import { Metrics } from '../utils/metrics';

export interface EvaluationResult {
  metrics: Record<string, number>;
  executionTime: number;
}

export class ModelEvaluator {
  private readonly metrics: string[];
  
  constructor(metrics: string[] = ['accuracy', 'precision', 'recall', 'f1']) {
    this.metrics = metrics;
  }
  
  evaluateRegression(model: BaseModel, features: number[][], actualValues: number[]): EvaluationResult {
    const startTime = performance.now();
    
    const predictions = model.predict(features) as number[];
    
    const result: Record<string, number> = {};
    
    for (const metric of this.metrics) {
      switch (metric) {
        case 'mse':
          result.mse = Metrics.meanSquaredError(actualValues, predictions);
          break;
        case 'rmse':
          result.rmse = Metrics.rootMeanSquaredError(actualValues, predictions);
          break;
        case 'mae':
          result.mae = Metrics.meanAbsoluteError(actualValues, predictions);
          break;
        case 'r2':
          result.r2 = Metrics.r2Score(actualValues, predictions);
          break;
      }
    }
    
    const endTime = performance.now();
    
    return {
      metrics: result,
      executionTime: endTime - startTime
    };
  }
  
  evaluateClassification(model: BaseModel, features: number[][], actualLabels: number[], numClasses = 2): EvaluationResult {
    const startTime = performance.now();
    
    const predictions = model.predict(features) as number[];
    
    const result: Record<string, number> = {};
    
    for (const metric of this.metrics) {
      switch (metric) {
        case 'accuracy':
          result.accuracy = Metrics.accuracy(actualLabels, predictions);
          break;
        case 'precision':
          result.precision = Metrics.precision(actualLabels, predictions);
          break;
        case 'recall':
          result.recall = Metrics.recall(actualLabels, predictions);
          break;
        case 'f1':
          result.f1 = Metrics.f1Score(actualLabels, predictions);
          break;
      }
    }
    
    // Confusion matrix
    result.confusionMatrix = Number(JSON.stringify(Metrics.confusionMatrix(actualLabels, predictions, numClasses)));
    
    const endTime = performance.now();
    
    return {
      metrics: result,
      executionTime: endTime - startTime
    };
  }
  
  crossValidate(model: BaseModel, features: number[][], labels: number[], folds = 5, isClassification = false): EvaluationResult[] {
    const foldSize = Math.floor(features.length / folds);
    const results: EvaluationResult[] = [];
    
    for (let i = 0; i < folds; i++) {
      // Bölünmüş veriler
      const testStart = i * foldSize;
      const testEnd = (i === folds - 1) ? features.length : (i + 1) * foldSize;
      
      const testFeatures = features.slice(testStart, testEnd);
      const testLabels = labels.slice(testStart, testEnd);
      
      const trainFeatures = [...features.slice(0, testStart), ...features.slice(testEnd)];
      const trainLabels = [...labels.slice(0, testStart), ...labels.slice(testEnd)];
      
      // Regresyon veya sınıflandırma değerlendirmesi
      const result = isClassification 
        ? this.evaluateClassification(model, testFeatures, testLabels)
        : this.evaluateRegression(model, testFeatures, testLabels);
      
      results.push(result);
    }
    
    return results;
  }
}