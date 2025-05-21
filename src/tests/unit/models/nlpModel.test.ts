import { NLPModel } from '../../../../src/models/nlpModel';

describe('NLPModel', () => {
  test('should initialize with default options', () => {
    const model = new NLPModel();
    expect(model.getModelName()).toBe('UnnamedModel');
    expect(model.getVocabularySize()).toBeGreaterThan(0);
    expect(model.getEmbeddingSize()).toBe(10);
  });
  
  test('should initialize with custom vocabulary', () => {
    const customVocab = ['apple', 'banana', 'cherry', 'date'];
    const model = new NLPModel({ vocabulary: customVocab });
    expect(model.getVocabularySize()).toBe(customVocab.length);
  });
  
  test('should embed text to fixed size vectors', () => {
    const model = new NLPModel();
    const text = 'this is a test';
    
    const embedding = model.embedText(text);
    
    expect(embedding).toHaveLength(model.getEmbeddingSize());
    // Girdiler için tutarlı çıktı üretilmeli
    expect(model.embedText(text)).toEqual(embedding);
  });
  test('should handle unknown words', () => {
    const model = new NLPModel({ vocabulary: ['known'] });
    const text = 'unknown word test';
    
    // Bilinmeyen kelimeler için embedding yine de üretilmeli
    const embedding = model.embedText(text);
    expect(embedding).toHaveLength(model.getEmbeddingSize());
  });
  test('should classify text sentiment', () => {
    const model = new NLPModel();
    
    const positiveResult = model.getSentiment('good happy wonderful');
    const negativeResult = model.getSentiment('bad terrible awful');
    const neutralResult = model.getSentiment('the a an');
    
    // Model seed tanımlı olmadığından deterministik değil, sadece basit kontroller
    expect(positiveResult).toHaveProperty('score');
    expect(positiveResult).toHaveProperty('label');
    expect(negativeResult).toHaveProperty('score');
    expect(negativeResult).toHaveProperty('label');
    expect(neutralResult).toHaveProperty('score');
    expect(neutralResult).toHaveProperty('label');
  });
  test('should produce deterministic embeddings with seed', () => {
    const model1 = new NLPModel({ seed: 42 });
    const model2 = new NLPModel({ seed: 42 });
    
    const text = 'test text';
    
    const embedding1 = model1.embedText(text);
    const embedding2 = model2.embedText(text);
    
    // Aynı tohum için aynı embedding üretilmeli
    expect(embedding1).toEqual(embedding2);
  });
});
