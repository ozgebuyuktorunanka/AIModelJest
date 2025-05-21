export interface ModelOptions {
    seed?: number;
    name?: string;
  }

  export abstract class BaseModel {
    protected readonly seed?: number;
    protected readonly name: string;
  
    constructor(options: ModelOptions = {}) {
      this.seed = options.seed;
      this.name = options.name || 'UnnamedModel';
    }
  
    abstract predict(input: unknown): unknown;
    
    getModelName(): string {
      return this.name;
    }
    
    getConfidence(): number {
      // Default güven skoru hesaplaması
      if (this.seed !== undefined) {
        return 0.7 + (this.generatePseudoRandom(this.seed + 1) * 0.25);
      }
      return 0.7 + (Math.random() * 0.25); // 0.7 ile 0.95 arasında
    }
    
    protected generatePseudoRandom(seed: number): number {
      // Deterministik pseudo-random sayı üreteci
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }
  }