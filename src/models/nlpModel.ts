import { BaseModel, ModelOptions } from './baseModel';

export interface NLPModelOptions extends ModelOptions {
  vocabulary?: string[];
  embeddingSize?: number;
}

export class NLPModel extends BaseModel {
  private readonly vocabulary: Map<string, number>;
  private readonly embeddingSize: number;
  private readonly embeddings: number[][];
  
  constructor(options: NLPModelOptions = {}) {
    super(options);
    this.embeddingSize = options.embeddingSize || 10;
    
    // Vocabulary oluştur
    this.vocabulary = new Map<string, number>();
    if (options.vocabulary) {
      options.vocabulary.forEach((word, index) => {
        this.vocabulary.set(word.toLowerCase(), index);
      });
    } else {
      // Örnek bir vocabulary
      const defaultVocab = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'good', 'bad', 'happy', 'sad'];
      defaultVocab.forEach((word, index) => {
        this.vocabulary.set(word.toLowerCase(), index);
      });
    }
    
    // Rastgele embeddings oluştur
    this.embeddings = Array(this.vocabulary.size).fill(0).map((_, i) => {
      return Array(this.embeddingSize).fill(0).map(() => {
        if (this.seed !== undefined) {
          return this.generatePseudoRandom(this.seed + i) * 2 - 1; // -1 ile 1 arasında
        }
        return Math.random() * 2 - 1; // -1 ile 1 arasında
      });
    });
  }
  
  predict(input: string[]): number[][] {
    return input.map(text => this.embedText(text));
  }
  
  // Metin içindeki kelimeleri embedlere dönüştür
  embedText(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const embeddings = words.map(word => {
      const wordIndex = this.vocabulary.get(word);
      if (wordIndex !== undefined) {
        return this.embeddings[wordIndex];
      }
      // Bilinmeyen kelimeler için sıfır embedding
      return Array(this.embeddingSize).fill(0);
    });
    
    // Tüm kelime embeddinglerini ortalama alarak bir metin embedding'i oluştur
    const result = Array(this.embeddingSize).fill(0);
    if (embeddings.length > 0) {
      for (const wordEmbedding of embeddings) {
        for (let i = 0; i < this.embeddingSize; i++) {
          result[i] += wordEmbedding[i];
        }
      }
      for (let i = 0; i < this.embeddingSize; i++) {
        result[i] /= embeddings.length;
      }
    }
    
    return result;
  }
  
  // Metin sınıflandırma (sentiment analizi gibi)
  classifyText(text: string): number {
    const embedding = this.embedText(text);
    // Embedding'in ortalaması pozitifse pozitif, negatifse negatif sınıflandırma yap
    const average = embedding.reduce((a, b) => a + b, 0) / embedding.length;
    return average > 0 ? 1 : 0; // 1: pozitif, 0: negatif
  }
  
  getSentiment(text: string): { score: number; label: string } {
    const embedding = this.embedText(text);
    // Embedding'in ortalaması duygu skorunu belirler (-1 ile 1 arasında)
    const score = embedding.reduce((a, b) => a + b, 0) / embedding.length;
    
    // Skoru -1 ile 1 arasında sınırla
    const normalizedScore = Math.max(-1, Math.min(1, score));
    
    // Skora göre etiket belirle
    let label = 'neutral';
    if (normalizedScore > 0.3) label = 'positive';
    else if (normalizedScore < -0.3) label = 'negative';
    
    return { score: normalizedScore, label };
  }
  
  getVocabularySize(): number {
    return this.vocabulary.size;
  }
  
  getEmbeddingSize(): number {
    return this.embeddingSize;
  }
}