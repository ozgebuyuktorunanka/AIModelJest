import { BaseModel } from '../models/baseModel';

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  type: string;
  description?: string;
  metrics?: Record<string, number>;
}
export class ModelRegistry {
    private readonly models: Map<string, BaseModel>;
    private readonly metadata: Map<string, ModelMetadata>;
    
    constructor() {
      this.models = new Map<string, BaseModel>();
      this.metadata = new Map<string, ModelMetadata>();
    }
    registerModel(
        id: string, 
        model: BaseModel, 
        metadata: Omit<ModelMetadata, 'id' | 'createdAt' | 'updatedAt'>
      ): void {
        if (this.models.has(id)) {
          throw new Error(`Model with ID ${id} already exists`);
        }
        
        const now = Date.now();
        const fullMetadata: ModelMetadata = {
          ...metadata,
          id,
          createdAt: now,
          updatedAt: now
        };
        
        this.models.set(id, model);
        this.metadata.set(id, fullMetadata);
      }
      getModel(id: string): BaseModel | undefined {
        return this.models.get(id);
      }
      
      getMetadata(id: string): ModelMetadata | undefined {
        return this.metadata.get(id);
      }
      
      updateMetadata(id: string, updates: Partial<Omit<ModelMetadata, 'id' | 'createdAt'>>): boolean {
        const metadata = this.metadata.get(id);
        if (!metadata) {
          return false;
        }
        
        this.metadata.set(id, {
          ...metadata,
          ...updates,
          updatedAt: Date.now()
        });
        
        return true;
      }unregisterModel(id: string): boolean {
        if (!this.models.has(id)) {
          return false;
        }
        
        this.models.delete(id);
        this.metadata.delete(id);
        return true;
      }
      
      listModels(): ModelMetadata[] {
        return Array.from(this.metadata.values());
      }
      findModelsByType(type: string): ModelMetadata[] {
        return this.listModels().filter(metadata => metadata.type === type);
      }
      
      getModelsByPerformance(metricName: string, ascending = false): ModelMetadata[] {
        const models = this.listModels().filter(m => 
          m.metrics !== undefined && metricName in m.metrics!
        );
        
        return models.sort((a, b) => {
          const valueA = a.metrics![metricName];
          const valueB = b.metrics![metricName];
          return ascending ? valueA - valueB : valueB - valueA;
        });
      }
    }