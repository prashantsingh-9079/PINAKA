import React, { useState } from 'react';
import { EvaluationControls } from '../components/EvaluationControls';
import { EvaluationResults } from '../components/EvaluationResults';
import { EvaluationCharts } from '../components/EvaluationCharts';

export const Evaluation = () => {
  const [lastConfig, setLastConfig] = useState(null);

  const handleRunEvaluation = (config: any) => {
    setLastConfig(config);
    // In a real app, this would trigger the evaluation process
    // The EvaluationResults and EvaluationCharts would update via props or state
  };

  return (
    <div className="evaluation-page">
      <div className="page-header">
        <h1>Evaluation & Testing</h1>
        <p className="page-subtitle">
          Offline evaluation, model testing, and performance analysis
        </p>
      </div>

      <div className="evaluation-content">
        <div className="evaluation-sidebar">
          <EvaluationControls onRunEvaluation={handleRunEvaluation} />
          {lastConfig && (
            <div className="eval-config-summary">
              <h3>Last Configuration</h3>
              <p><strong>Type:</strong> {lastConfig.evaluationType}</p>
              <p><strong>Dataset:</strong> {lastConfig.dataset}</p>
              <p><strong>Model:</strong> {lastConfig.modelVersion}</p>
              <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
          )}
        </div>
        <div className="evaluation-main">
          <EvaluationResults />
          <EvaluationCharts />
        </div>
      </div>
    </div>
  );
};