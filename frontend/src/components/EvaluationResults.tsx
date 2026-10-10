import React, { useState, useEffect } from 'react';

interface EvaluationResult {
  metric: string;
  value: number;
  unit: string;
  change: number; // percentage change from baseline
  status: 'improved' | 'degraded' | 'stable';
}

interface EvaluationResultsProps {
  onConfigChange: (config: any) => void;
}

export const EvaluationResults = ({ onConfigChange }: EvaluationResultsProps) => {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  // Simulate running evaluation when config changes
  useEffect(() => {
    // This would be triggered by parent component when evaluation runs
    // For now, we'll simulate occasional updates
  }, []);

  const runSimulation = () => {
    setIsRunning(true);
    // Simulate evaluation running
    setTimeout(() => {
      const newResults: EvaluationResult[] = [
        {
          metric: 'mAP@0.5',
          value: 0.782,
          unit: '',
          change: 5.2,
          status: 'improved'
        },
        {
          metric: 'mAP@0.75',
          value: 0.645,
          unit: '',
          change: -2.1,
          status: 'degraded'
        },
        {
          metric: 'Precision',
          value: 0.821,
          unit: '',
          change: 3.8,
          status: 'improved'
        },
        {
          metric: 'Recall',
          value: 0.763,
          unit: '',
          change: -1.5,
          status: 'degraded'
        },
        {
          metric: 'F1-Score',
          value: 0.791,
          unit: '',
          change: 1.2,
          status: 'improved'
        },
        {
          metric: 'Avg Precision (AP)',
          value: 0.714,
          unit: '',
          change: 0.8,
          status: 'stable'
        },
        {
          metric: 'False Alarms/Hour',
          value: 2.3,
          unit: '',
          change: -15.7,
          status: 'improved' // Lower is better for false alarms
        },
        {
          metric: 'Detection Latency',
          value: 42.5,
          unit: 'ms',
          change: 8.3,
          status: 'degraded' // Higher is worse for latency
        }
      ];
      setResults(newResults);
      setIsRunning(false);
      setLastRunTime(new Date().toLocaleString());
    }, 3000); // Simulate 3-second evaluation
  };

  return (
    <div className="evaluation-results">
      <div className="results-header">
        <h2>Evaluation Results</h2>
        <div className="results-actions">
          <button
            className="btn btn-sm btn-outline"
            onClick={runSimulation}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Evaluation'}
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {}}
          >
            Export Results
          </button>
        </div>
        {lastRunTime && (
          <div className="results-timestamp">
            Last run: {lastRunTime}
          </div>
        )}
      </div>

      {isRunning ? (
        <div className="evaluation-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }}></div>
          </div>
          <p>Running evaluation on selected dataset...</p>
          <p className="progress-details">
            Processing 1,243 images • 42% complete
          </p>
        </div>
      ) : (
        results.length > 0 ? (
          <div className="results-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Change</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.metric}</td>
                    <td>{result.value.toFixed(3)} {result.unit}</td>
                    <td>
                      <span className={`change-${result.change >= 0 ? 'positive' : 'negative'}`}>
                        {result.change >= 0 ? '+' : ''}{result.change.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className={`status-dot status-${result.status === 'improved' ? 'online' : result.status === 'degraded' ? 'offline' : 'degraded'}`}></span>
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="results-empty">
            <div className="empty-icon">📊</div>
            <h3>No evaluation results yet</h3>
            <p>Configure and run an evaluation to see results here.</p>
            <button className="btn btn-secondary" onClick={runSimulation}>
              Run Evaluation
            </button>
          </div>
        )
      )}
    </div>
  );
};