// This TypeScript code defines a DataProcessor class that provides functionality for data preprocessing,
// including standardization, normalization, and handling missing values. The class allows fitting on a dataset to 
// compute necessary statistics (means, standard deviations, mins, and maxs) and then transforming the dataset based on these statistics. 
// It includes methods for fitting the data, transforming it, and retrieving computed statistics.

export interface DataProcessorOptions {
    standardize?: boolean;
    normalize?: boolean;
    fillMissing?: boolean;
    fillValue?: number;
  }
  export class DataProcessor {
    private readonly standardize: boolean;
    private readonly normalize: boolean;
    private readonly fillMissing: boolean;
    private readonly fillValue: number;
    private means: number[] = [];
    private stds: number[] = [];
    private mins: number[] = [];
    private maxs: number[] = [];
    
    constructor(options: DataProcessorOptions = {}) {
      this.standardize = options.standardize ?? false;
      this.normalize = options.normalize ?? false;
      this.fillMissing = options.fillMissing ?? true;
      this.fillValue = options.fillValue ?? 0;
    }
    
    fit(data: number[][]): void {
      if (!data || data.length === 0) {
        throw new Error('Cannot fit on empty dataset');
      }
      
      const numFeatures = data[0].length;
      this.means = Array(numFeatures).fill(0);
      this.stds = Array(numFeatures).fill(0);
      this.mins = Array(numFeatures).fill(Number.MAX_VALUE);
      this.maxs = Array(numFeatures).fill(Number.MIN_VALUE);
        // Ortalama ve min/max değerleri hesapla
        for (const row of data) {
            for (let i = 0; i < numFeatures; i++) {
              if (!isNaN(row[i])) {
                this.means[i] += row[i];
                this.mins[i] = Math.min(this.mins[i], row[i]);
                this.maxs[i] = Math.max(this.maxs[i], row[i]);
              }
            }
          }
          
          for (let i = 0; i < numFeatures; i++) {
            this.means[i] /= data.length;
          }
          
          // Standart sapma hesapla
          for (const row of data) {
            for (let i = 0; i < numFeatures; i++) {
              if (!isNaN(row[i])) {
                this.stds[i] += Math.pow(row[i] - this.means[i], 2);
              }
            }
          }
          for (let i = 0; i < numFeatures; i++) {
            this.stds[i] = Math.sqrt(this.stds[i] / data.length);
            if (this.stds[i] === 0) this.stds[i] = 1; // Sıfıra bölme hatası önleme
          }
        }
        
        transform(data: number[][]): number[][] {
          if (!data || data.length === 0) {
            return [];
          }
          
          const numFeatures = data[0].length;
          if (this.means.length === 0 || this.means.length !== numFeatures) {
            throw new Error('Processor not fitted or incompatible with input data');
          }
          
          return data.map(row => {
            return row.map((value, i) => {
              // Eksik değerleri doldur
              if (isNaN(value) && this.fillMissing) {
                value = this.fillValue;
              }  
              // Standardizasyon: (x - mean) / std
              if (this.standardize) {
                value = (value - this.means[i]) / this.stds[i];
              }
              
              // Normalizasyon: (x - min) / (max - min)
              if (this.normalize) {
                const range = this.maxs[i] - this.mins[i];
                value = range === 0 ? 0 : (value - this.mins[i]) / range;
              }
              
              return value;
            });
          });
        }fitTransform(data: number[][]): number[][] {
            this.fit(data);
            return this.transform(data);
          }
          
          getMeans(): number[] {
            return [...this.means];
          }
          
          getStds(): number[] {
            return [...this.stds];
          }
          
          getMins(): number[] {
            return [...this.mins];
          }
          
          getMaxs(): number[] {
            return [...this.maxs];
          }
        }        
  