export class AIModel {
  private readonly seed?: number;

  constructor(options?: { seed?: number }) {
    this.seed = options?.seed;
  }

  predict(input: number[]): number {
    if (input.length === 0) return 0;
    
    if (this.seed !== undefined) {
      const randomOffset = this.generatePseudoRandom(this.seed) * 0.1;
      return (input.reduce((sum, val) => sum + val, 0) / input.length) + randomOffset;
    }
    return input.reduce((sum, val) => sum + val, 0) / input.length;
  }
  
  getConfidence(): number {
    if (this.seed !== undefined) {
      return 0.75 + (this.generatePseudoRandom(this.seed + 1) * 0.2);
    }
    return 0.75 + (Math.random() * 0.2); // 0.75 ile 0.95 arasında
  }
  
  private generatePseudoRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
}