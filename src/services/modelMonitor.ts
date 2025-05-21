import { BaseModel } from '../models/baseModel';
import { Metrics } from '../utils/metrics';

export interface MonitoringAlert {
  modelId: string;
  metricName: string;
  threshold: number;
  actualValue: number;
  timestamp: number;
}

export interface MonitoringConfig {
    metricThresholds: Record<string, number>;
    checkInterval?: number; // milisaniye cinsinden
    alertHandler?: (alert: MonitoringAlert) => void;
  }

  export class ModelMonitor {
    private readonly monitoredModels: Map<string, { 
      model: BaseModel;
      config: MonitoringConfig;
      validationData: { features: number[][]; labels: number[] };
      isClassification: boolean;
    }>;
    private readonly alerts: MonitoringAlert[];
    private intervalIds: Record<string, NodeJS.Timeout> = {};
    
    constructor() {
      this.monitoredModels = new Map();
      this.alerts = [];
    }
    registerModel(
        modelId: string, 
        model: BaseModel, 
        validationData: { features: number[][]; labels: number[] },
        config: MonitoringConfig,
        isClassification = false
      ): void {
        if (this.monitoredModels.has(modelId)) {
          throw new Error(`Model with ID ${modelId} is already being monitored`);
        }
        this.monitoredModels.set(modelId, { model, config, validationData, isClassification });
    
        // Periyodik kontrol başlat
        if (config.checkInterval) {
          this.intervalIds[modelId] = setInterval(() => {
            this.checkModelPerformance(modelId);
          }, config.checkInterval);
        }
      }
      
      unregisterModel(modelId: string): boolean {
        if (!this.monitoredModels.has(modelId)) {
          return false;
        }
        
        // Periyodik kontrolü durdur
        if (this.intervalIds[modelId]) {
          clearInterval(this.intervalIds[modelId]);
          delete this.intervalIds[modelId];
        }
        
        return this.monitoredModels.delete(modelId);
      }
       
  checkModelPerformance(modelId: string): MonitoringAlert[] {
    const modelInfo = this.monitoredModels.get(modelId);
    if (!modelInfo) {
      throw new Error(`Model with ID ${modelId} is not being monitored`);
    }
    
    const { model, config, validationData, isClassification } = modelInfo;
    const { features, labels } = validationData;
    
    const predictions = model.predict(features) as number[];
    const newAlerts: MonitoringAlert[] = [];
    
    // Metrikleri kontrol et
    for (const [metricName, threshold] of Object.entries(config.metricThresholds)) {
      let actualValue: number;
      if (isClassification) {
        switch (metricName) {
          case 'accuracy':
            actualValue = Metrics.accuracy(labels, predictions);
            break;
          case 'precision':
            actualValue = Metrics.precision(labels, predictions);
            break;
          case 'recall':
            actualValue = Metrics.recall(labels, predictions);
            break;
          case 'f1':
            actualValue = Metrics.f1Score(labels, predictions);
            break;
          default:
            continue; // Bilinmeyen metriği atla
        }
      } else {
        switch (metricName) {
            case 'mse':
            actualValue = Metrics.meanSquaredError(labels, predictions);
            break;
          case 'rmse':
            actualValue = Metrics.rootMeanSquaredError(labels, predictions);
            break;
          case 'mae':
            actualValue = Metrics.meanAbsoluteError(labels, predictions);
            break;
          case 'r2':
            actualValue = Metrics.r2Score(labels, predictions);
            break;
          default:
            continue; // Bilinmeyen metriği atla
        }
      }
      // Eşik kontrolü
      const isHigherBetter = ['accuracy', 'precision', 'recall', 'f1', 'r2'].includes(metricName);
      const alertCondition = isHigherBetter ? actualValue < threshold : actualValue > threshold;
      
      if (alertCondition) {
        const alert: MonitoringAlert = {
          modelId,
          metricName,
          threshold,
          actualValue,
          timestamp: Date.now()
        };
        
        newAlerts.push(alert);
        this.alerts.push(alert);
        
        // Alert handler'ı çağıra
        if (config.alertHandler) {
          config.alertHandler(alert);
        }
      }
    }
    
    return newAlerts;
  } getAlerts(modelId?: string): MonitoringAlert[] {
    if (modelId) {
      return this.alerts.filter(alert => alert.modelId === modelId);
    }
    return [...this.alerts];
  }
  
  clearAlerts(modelId?: string): void {
    if (modelId) {
      const idx = this.alerts.findIndex(alert => alert.modelId === modelId);
      if (idx !== -1) {
        this.alerts.splice(idx, 1);
      }
    } else {
      this.alerts.length = 0;
    }
  }
}