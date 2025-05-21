import { BaseModel } from '../models/baseModel';

export interface PredictionResult<T> {
  prediction: T;
  confidence?: number;
  timestamp: number;
  modelName: string;
}

export class PredictionService {
  private readonly models: Map<string, BaseModel>;
  private readonly threshold?: number;
  private readonly logPredictions: boolean;
  private predictionLog: Array<{input: unknown; result: PredictionResult<unknown>}> = [];
  
  constructor(options: { defaultThreshold?: number; logPredictions?: boolean } = {}) {
    this.models = new Map<string, BaseModel>();
    this.threshold = options.defaultThreshold;
    this.logPredictions = options.logPredictions ?? false;
  }
  
  registerModel(id: string, model: BaseModel): void {
    if (this.models.has(id)) {
      throw new Error(`Model with ID ${id} already exists`);
    }
    this.models.set(id, model);
  }
  unregisterModel(id: string): boolean {
    return this.models.delete(id);
  }
  
  getModel(id: string): BaseModel | undefined {
    return this.models.get(id);
  }
  
  predict<T>(modelId: string, input: unknown): PredictionResult<T> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model with ID ${modelId} not found`);
    }
    
    const prediction = model.predict(input) as T;
    const confidence = model.getConfidence();
    const result = {
      prediction,
      confidence,
      timestamp: Date.now(),
      modelName: model.getModelName()
    }; if (this.logPredictions) {
        this.predictionLog.push({input, result});
      }
      
      return result;
    }

  batchPredict<T>(modelId: string, inputs: unknown[]): PredictionResult<T>[] {
    return inputs.map(input => this.predict<T>(modelId, input));
  }
  
  getPredictionLog(): Array<{input: unknown; result: PredictionResult<unknown>}> {
    return [...this.predictionLog];
  }
  
  clearPredictionLog(): void {
    this.predictionLog = [];
  }
}