import React, { useState } from 'react';

interface EvaluationControlsProps {
  onRunEvaluation: (config: any) => void;
}

export const EvaluationControls = ({ onRunEvaluation }: EvaluationControlsProps) => {
  const [config, setConfig] = useState({
    evaluationType: 'vision_only',
    dataset: 'visdrone_subset',
    modelVersion: 'yolov8n-drone-v2.1',
    confThreshold: 0.5,
    iouThreshold: 0.45,
    maxDet: 300,
    timeRange: 'last_24h',
    includeDifficult: true,
    generateReport: true
  });

  const evaluationTypes = [
    { value: 'vision_only', label: 'Vision Only' },
    { value: 'rf_only', label: 'RF Classifier Only' },
    { value: 'vision_rf_late_fusion', label: 'Vision + RF Late Fusion' },
    { value: 'vision_rf_radar_fusion', label: 'Vision + RF + Radar Fusion' },
    { value: 'all_sensors', label: 'All Sensors Fusion' }
  ];

  const datasets = [
    { value: 'visdrone_subset', label: 'VisDrone Subset' },
    { value: 'custom_test_set', label: 'Custom Test Set' },
    { value: 'urban_scenarios', label: 'Urban Scenarios' },
    { value: 'rural_scenarios', label: 'Rural Scenarios' },
    { value: 'night_conditions', label: 'Night Conditions' },
    { value: 'adverse_weather', label: 'Adverse Weather' }
  ];

  const modelVersions = [
    { value: 'yolov8n-drone-v2.1', label: 'YOLOv8n Drone v2.1' },
    { value: 'yolov8s-drone-v2.1', label: 'YOLOv8s Drone v2.1' },
    { value: 'yolov8m-drone-v2.1', label: 'YOLOv8m Drone v2.1' },
    { value: 'yolov8l-drone-v2.1', label: 'YOLOv8l Drone v2.1' },
    { value: 'yolov8x-drone-v2.1', label: 'YOLOv8x Drone v2.1' },
    { value: 'faster-rcnn-drone-v1.8', label: 'Faster R-CNN Drone v1.8' }
  ];

  const timeRanges = [
    { value: 'last_1h', label: 'Last 1 Hour' },
    { value: 'last_6h', label: 'Last 6 Hours' },
    { value: 'last_24h', label: 'Last 24 Hours' },
    { value: 'last_7d', label: 'Last 7 Days' },
    { value: 'last_30d', label: 'Last 30 Days' },
    { value: 'custom_range', label: 'Custom Range' }
  ];

  const handleRunEvaluation = () => {
    onRunEvaluation({ ...config });
  };

  return (
    <div className="evaluation-controls">
      <div className="controls-header">
        <h2>Evaluation Configuration</h2>
      </div>

      <div className="controls-form">
        <div className="form-section">
          <h3>Evaluation Setup</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Evaluation Type</label>
              <select
                value={config.evaluationType}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  evaluationType: e.target.value as any
                }))}
                className="form-select"
              >
                {evaluationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Dataset</label>
              <select
                value={config.dataset}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  dataset: e.target.value as any
                }))}
                className="form-select"
              >
                {datasets.map(dataset => (
                  <option key={dataset.value} value={dataset.value}>
                    {dataset.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Model Version</label>
              <select
                value={config.modelVersion}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  modelVersion: e.target.value as any
                }))}
                className="form-select"
              >
                {modelVersions.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time Range</label>
              <select
                value={config.timeRange}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  timeRange: e.target.value as any
                }))}
                className="form-select"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Detection Parameters</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Confidence Threshold</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={config.confThreshold}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    confThreshold: parseFloat(e.target.value)
                  }))}
                  className="slider-input"
                />
                <div className="slider-value">
                  {config.confThreshold.toFixed(2)}
                </div>
              </div>
              <p className="help-text">Minimum confidence for detection consideration</p>
            </div>

            <div className="form-group">
              <label>IoU Threshold</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={config.iouThreshold}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    iouThreshold: parseFloat(e.target.value)
                  }))}
                  className="slider-input"
                />
                <div className="slider-value">
                  {config.iouThreshold.toFixed(2)}
                </div>
              </div>
              <p className="help-text">Intersection over Union threshold for NMS</p>
            </div>

            <div className="form-group">
              <label>Max Detections</label>
              <select
                value={config.maxDet}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  maxDet: parseInt(e.target.value)
                }))}
                className="form-select"
              >
                [100, 200, 300, 500, 1000].map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))
              </select>
              <p className="help-text">Maximum detections per image</p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Options</h3>
          <div className="options-checklist">
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={config.includeDifficult}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  includeDifficult: e.target.checked
                }))}
              />
              Include Difficult Samples
            </label>
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={config.generateReport}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  generateReport: e.target.checked
                }))}
              />
              Generate Detailed Report
            </label>
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={false}
                onChange={(e) => {}}
                disabled
              />
              Save Models (Coming Soon)
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn btn-outline"
            onClick={() => {
              // Reset to defaults
              setConfig({
                evaluationType: 'vision_only',
                dataset: 'visdrone_subset',
                modelVersion: 'yolov8n-drone-v2.1',
                confThreshold: 0.5,
                iouThreshold: 0.45,
                maxDet: 300,
                timeRange: 'last_24h',
                includeDifficult: true,
                generateReport: true
              });
            }}
          >
            Reset to Defaults
          </button>
          <button
            className="btn btn-primary"
            onClick={handleRunEvaluation}
          >
            Run Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};