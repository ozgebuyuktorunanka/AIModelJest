
export class Metrics {
    // Regresyon metrikleri
    static meanSquaredError(actual: number[], predicted: number[]): number {
      if (actual.length !== predicted.length) {
        throw new Error('Arrays must have the same length');
      }
      
      let sum = 0;
      for (let i = 0; i < actual.length; i++) {
        sum += Math.pow(actual[i] - predicted[i], 2);
      }
      
      return sum / actual.length;
    }
    
    static rootMeanSquaredError(actual: number[], predicted: number[]): number {
      return Math.sqrt(this.meanSquaredError(actual, predicted));
    }
    
    static meanAbsoluteError(actual: number[], predicted: number[]): number {
      if (actual.length !== predicted.length) {
        throw new Error('Arrays must have the same length');
      }
      
      let sum = 0;
      for (let i = 0; i < actual.length; i++) {
        sum += Math.abs(actual[i] - predicted[i]);
      }
      
      return sum / actual.length;
    }
    
    static r2Score(actual: number[], predicted: number[]): number {
      if (actual.length !== predicted.length) {
        throw new Error('Arrays must have the same length');
      }
      
      const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
      
      let ssTotal = 0;
      let ssResidual = 0;
      
      for (let i = 0; i < actual.length; i++) {
        ssTotal += Math.pow(actual[i] - mean, 2);
        ssResidual += Math.pow(actual[i] - predicted[i], 2);
      }
      
      return 1 - (ssResidual / ssTotal);
    }
    
    // Sınıflandırma metrikleri
    static accuracy(actual: number[], predicted: number[]): number {
      if (actual.length !== predicted.length) {
        throw new Error('Arrays must have the same length');
      }
      
      let correct = 0;
      for (let i = 0; i < actual.length; i++) {
        if (actual[i] === predicted[i]) {
          correct++;
        }
      }
      
      return correct / actual.length;
    }
    
    static precision(actual: number[], predicted: number[], positiveClass = 1): number {
      if (actual.length !== predicted.length) {
        throw new Error('Arrays must have the same length');
      }
      
      let truePositives = 0;
      let falsePositives = 0;
      
      for (let i = 0; i < actual.length; i++) {
        if (predicted[i] === positiveClass) {
          if (actual[i] === positiveClass) {
            truePositives++;
          } else {
            falsePositives++;
          }
        }
      }
      
      return truePositives + falsePositives === 0 ? 0 : truePositives / (truePositives + falsePositives);
    }
    
    static recall(actual: number[], predicted: number[], positiveClass = 1): number {
      if (actual.length !== predicted.length) {
        throw new Error('Arrays must have the same length');
      }
      
      let truePositives = 0;
      let falseNegatives = 0;
      
      for (let i = 0; i < actual.length; i++) {
        if (actual[i] === positiveClass) {
          if (predicted[i] === positiveClass) {
            truePositives++;
          } else {
            falseNegatives++;
          }
        }
      }
      
      return truePositives + falseNegatives === 0 ? 0 : truePositives / (truePositives + falseNegatives);
    }
    
    static f1Score(actual: number[], predicted: number[], positiveClass = 1): number {
      const precision = this.precision(actual, predicted, positiveClass);
      const recall = this.recall(actual, predicted, positiveClass);
      
      return precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
    }
    
    static confusionMatrix(actual: number[], predicted: number[], numClasses: number): number[][] {
      if (actual.length !== predicted.length) {
        throw new Error('Arrays must have the same length');
      }
      
      // Initialize confusion matrix with zeros
      const matrix: number[][] = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));
      
      for (let i = 0; i < actual.length; i++) {
        if (actual[i] >= 0 && actual[i] < numClasses && predicted[i] >= 0 && predicted[i] < numClasses) {
          matrix[actual[i]][predicted[i]]++;
        }
      }
      
      return matrix;
    }
  }
  