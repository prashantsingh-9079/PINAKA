import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const EvaluationCharts = () => {
  const [chartsData, setChartsData] = useState({});

  // Initialize chart data
  useEffect(() => {
    setChartsData({
      metricTrends: [
        { date: 'Day 1', mAP: 0.72, precision: 0.78, recall: 0.68, f1: 0.73 },
        { date: 'Day 2', mAP: 0.74, precision: 0.80, recall: 0.70, f1: 0.76 },
        { date: 'Day 3', mAP: 0.71, precision: 0.76, recall: 0.69, f1: 0.72 },
        { date: 'Day 4', mAP: 0.76, precision: 0.82, recall: 0.72, f1: 0.77 },
        { date: 'Day 5', mAP: 0.78, precision: 0.84, recall: 0.74, f1: 0.79 },
        { date: 'Day 6', mAP: 0.75, precision: 0.81, recall: 0.71, f1: 0.76 },
        { date: 'Day 7', mAP: 0.782, precision: 0.821, recall: 0.763, f1: 0.791 }
      ],
      sensorContribution: [
        { name: 'Vision', value: 45 },
        { name: 'RF', value: 25 },
        { name: 'Radar', value: 20 },
        { name: 'Thermal', value: 10 }
      ],
      confusionMatrix: [
        { actual: 'drone', predicted_drone: 85, predicted_bird: 10, predicted_unknown: 5 },
        { actual: 'bird', predicted_drone: 8, predicted_bird: 82, predicted_unknown: 10 },
        { actual: 'unknown', predicted_drone: 3, predicted_bird: 7, predicted_unknown: 90 }
      ],
      latencyDistribution: [
        { range: '0-20ms', count: 15 },
        { range: '20-40ms', count: 42 },
        { range: '40-60ms', count: 28 },
        { range: '60-80ms', count: 10 },
        { range: '80-100ms', count: 3 },
        { range: '100ms+', count: 2 }
      ]
    });
  }, []);

  return (
    <div className="evaluation-charts">
      <div className="charts-header">
        <h2>Evaluation Analytics</h2>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Metric Trends Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartsData.metricTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mAP" stroke="#2196f3" name="mAP" />
                <Line type="monotone" dataKey="precision" stroke="#ff9800" name="Precision" />
                <Line type="monotone" dataKey="recall" stroke="#9c27b0" name="Recall" />
                <Line type="monotone" dataKey="f1" stroke="#4caf50" name="F1-Score" />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-insights">
              <p>Shows how key metrics have evolved over the evaluation period</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Sensor Contribution Analysis</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartsData.sensorContribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${percent}%`
                  }
                >
                  {chartsData.sensorContribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#2196f3', '#ff9800', '#9c27b0', '#4caf50'][index]} />
                  ))}
                </Pie>
              </ResponsiveContainer>
            </ResponsiveContainer>
            <div className="chart-insights">
              <p>Breakdown of which sensor modalities contributed most to detections</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Confusion Matrix</h3>
          <div className="chart-container">
            <div className="confusion-matrix">
              <div className="matrix-header">
                <div className="matrix-cell empty"></div>
                <div className="matrix-cell header">Predicted: Drone</div>
                <div className="matrix-cell header">Predicted: Bird</div>
                <div className="matrix-cell header">Predicted: Unknown</div>
              </div>
              {chartsData.confusionMatrix.map((row, rowIndex) => (
                <div key={`matrix-row-${rowIndex}`} className="matrix-row">
                  <div className="matrix-cell header">Actual: {row.actual}</div>
                  {[['predicted_drone', 'predicted_bird'], ['predicted_bird', 'predicted_unknown'], ['predicted_unknown', 'predicted_drone']].map(([key1, key2], colIndex) => {
                    const value = colIndex === 0 ? row.predicted_drone :
                                 colIndex === 1 ? row.predicted_bird :
                                 row.predicted_unknown;
                    return (
                      <div key={`cell-${rowIndex}-${colIndex}`} className="matrix-cell">
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="chart-insights">
              <p>
                Shows classification performance: diagonal values are correct predictions,<br/>
                off-diagonal values are misclassifications between classes
              </p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Detection Latency Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsData.latencyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2196f3" barSize={0.6} />
              </ResponsiveContainer>
            </ResponsiveContainer>
            <div className="chart-insights">
              <p>
                Distribution of detection latencies - lower is better for real-time tracking<br/>
                Most detections fall in the 20-60ms range which is suitable for tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};