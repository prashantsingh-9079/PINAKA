import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const ClusteringChart = () => {
  const [clusters, setClusters] = useState([]);

  // Initialize with some cluster data and simulate updates
  useEffect(() => {
    // Generate initial clusters
    const initClusters = [];
    const numClusters = Math.floor(Math.random() * 3) + 1; // 1-3 clusters
    const colors = ['#2196f3', '#ff9800', '#9c27b0', '#f44336', '#4caf50'];

    for (let c = 0; c < numClusters; c++) {
      const clusterColor = colors[c % colors.length];
      const numPoints = Math.floor(Math.random() * 10) + 5; // 5-15 points per cluster
      const centerX = Math.random() * 80 + 10; // Random center
      const centerY = Math.random() * 60 + 20;
      const radius = Math.random() * 15 + 5; // Cluster spread

      for (let p = 0; p < numPoints; p++) {
        // Generate points around cluster center with some spread
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        initClusters.push({
          x: centerX + distance * Math.cos(angle),
          y: centerY + distance * Math.sin(angle),
          cluster: c,
          confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
          timestamp: Date.now() - Math.random() * 5000
        });
      }
    }

    setClusters(initClusters);

    // Simulate updates every 3-5 seconds
    const interval = setInterval(() => {
      // Sometimes add/remove clusters, sometimes move them
      if (Math.random() > 0.7) {
        // Regenerate clusters
        const newClusters = [];
        const numClusters = Math.floor(Math.random() * 3) + 1;
        const colors = ['#2196f3', '#ff9800', '#9c27b0', '#f44336', '#4caf50'];

        for (let c = 0; c < numClusters; c++) {
          const clusterColor = colors[c % colors.length];
          const numPoints = Math.floor(Math.random() * 10) + 5;
          const centerX = Math.random() * 80 + 10;
          const centerY = Math.random() * 60 + 20;
          const radius = Math.random() * 15 + 5;

          for (let p = 0; p < numPoints; p++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            newClusters.push({
              x: centerX + distance * Math.cos(angle),
              y: centerY + distance * Math.sin(angle),
              cluster: c,
              confidence: Math.random() * 0.3 + 0.7,
              timestamp: Date.now()
            });
          }
        }
        setClusters(newClusters);
      } else {
        // Just update existing clusters with small movements
        setClusters(prev => prev.map(point => ({
          ...point,
          x: point.x + (Math.random() - 0.5) * 2,
          y: point.y + (Math.random() - 0.5) * 2,
          timestamp: Date.now(),
          confidence: Math.max(0.5, point.confidence - 0.01)
        })));
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate cluster statistics
  const clusterStats = [];
  if (clusters.length > 0) {
    const clusterMap = new Map();
    clusters.forEach(point => {
      if (!clusterMap.has(point.cluster)) {
        clusterMap.set(point.cluster, {
          points: [],
          sumX: 0,
          sumY: 0,
          count: 0
        });
      });
      const cluster = clusterMap.get(point.cluster);
      cluster.points.push(point);
      cluster.sumX += point.x;
      cluster.sumY += point.y;
      cluster.count += 1;
    });

    clusterMap.forEach((cluster, clusterId) => {
      const centerX = cluster.sumX / cluster.count;
      const centerY = cluster.sumY / cluster.count;

      // Calculate radius (average distance from center)
      let totalDist = 0;
      cluster.points.forEach(point => {
        const dist = Math.sqrt(
          Math.pow(point.x - centerX, 2) +
          Math.pow(point.y - centerY, 2)
        );
        totalDist += dist;
      });
      const avgRadius = totalDist / cluster.count;

      // Calculate density (points per unit area)
      const area = Math.PI * Math.pow(avgRadius, 2);
      const density = area > 0 ? cluster.count / area : 0;

      clusterStats.push({
        id: clusterId,
        centerX,
        centerY,
        radius: avgRadius,
        density,
        pointCount: cluster.points.length,
        avgConfidence: cluster.points.reduce((sum, p) => sum + p.confidence, 0) / cluster.points.length
      });
    });
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Group Clustering Analysis</h3>
        <p className="chart-subtitle">
          Detected clusters with centroids, density, and confidence analysis
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart
          data={clusters}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            tick={{ fontSize: 12 }}
            label={{ value: 'X Position (m)', position: 'insideBottom' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: 'Y Position (m)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px', borderRadius: '4px' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
          />

          {/* Plot points by cluster */}
          {clusters.map((point, index) => (
            <Scatter
              key={`point-${index}`}
              data={{ x: point.x, y: point.y }}
              size={80}
              fill={point.cluster < 10 ?
                ['#2196f3', '#ff9800', '#9c27b0', '#f44336', '#4caf50'][point.cluster % 5] :
                '#9e9e9e'}
              strokeWidth={2}
              opacity={point.confidence}
            />
          ))}

          {/* Plot cluster centroids */}
          {clusterStats.map((stat, index) => (
            <Scatter
              key={`centroid-${index}`}
              data={{ x: stat.centerX, y: stat.centerY }}
              size={120}
              fill="rgba(255,255,255,0.9)"
              stroke={'#ffeb3b'}
              strokeWidth={3}
              opacity={0.9}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <div className="chart-info">
          {clusterStats.length > 0 && (
            <>
              <span>Detected Clusters: {clusterStats.length}</span>
              {clusterStats.map((stat, index) => (
                <span key={index} className="ml-4">
                  C{stat.id}: {stat.pointCount} pts
                </span>
              ))}
            </>
          )}
        </div>
        <div className="chart-insights">
          {clusterStats.length > 0 && (
            <>
              <h4>Clustering Insights</h4>
              <p>
                <strong>Centroids:</strong> White markers show cluster centers<br/>
                <strong>Point Size:</strong> Indicates confidence level<br/>
                <strong>Colors:</strong> Different clusters<br/>
                {clusterStats.length > 0 && (
                  <>
                    <br/>
                    <strong>Largest Cluster:</strong>
                    {clusterStats.reduce((max, stat) =>
                      stat.pointCount > max.pointCount ? stat : max, clusterStats[0]).pointCount} points
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};