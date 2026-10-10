import React, { useState } from 'react';

interface SearchResult {
  id: string;
  timestamp: string;
  similarity: number;
  snapshot: string;
  trackId: string | null;
  evidence: string[];
}

interface SearchResultsProps {
  results: SearchResult[] | null;
  query: string;
}

export const SearchResults = ({ results, query }: SearchResultsProps) => {
  const [verifiedResults, setVerifiedResults] = useState<Set<string>>(new Set());

  const handleVerify = (resultId: string) => {
    setVerifiedResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resultId)) {
        newSet.delete(resultId);
      } else {
        newSet.add(resultId);
      }
      return newSet;
    });
  };

  const handleReject = (resultId: string) => {
    setVerifiedResults(prev => {
      const newSet = new Set(prev);
      newSet.delete(resultId);
      return newSet;
    });
  };

  if (!results || results.length === 0) {
    return (
      <div className="results-empty">
        <div className="empty-icon">🔍</div>
        <h3>No results found</h3>
        <p>Try adjusting your search criteria or check if authorized snapshots are available.</p>
        {query && (
          <div className="search-history">
            <p>Last search: "{query}"</p>
          </div>
        )}
        <div className="search-suggestions">
          <h4>Suggestions:</h4>
          <ul>
            <li>Try a different image or description</li>
            <li>Check that your search terms are specific enough</li>
            <li>Ensure you have authorization to search the requested data</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h3>Search Results</h3>
        <p className="results-count">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
        <div className="results-actions">
          <button className="btn btn-sm btn-secondary">
            Export Results
          </button>
        </div>
      </div>

      <div className="results-list">
        {results.map((result) => (
          <div key={result.id} className={`result-item ${verifiedResults.has(result.id) ? 'verified' : ''}`}>
            <div className="result-header">
              <div className="result-info">
                <div className="result-timestamp">
                  <span>🕒</span>
                  {new Date(result.timestamp).toLocaleString()}
                </div>
                {result.trackId && (
                  <div className="result-track">
                    <span>🎯</span>
                    Track ID: {result.trackId}
                  </div>
                )}
              </div>
              <div className="result-verification">
                <button
                  className={`btn btn-sm ${verifiedResults.has(result.id) ? 'btn-success' : ''}`}
                  onClick={() => handleVerify(result.id)}
                >
                  {verifiedResults.has(result.id) ? 'Verified' : 'Verify'}
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleReject(result.id)}
                >
                  Reject
                </button>
              </div>
            </div>

            <div className="result-content">
              <div className="result-media">
                <div className="snapshot-preview">
                  <img
                    src={result.snapshot}
                    alt={`Snapshot from ${result.timestamp}`}
                    onError={(e) => {
                      e.target.src = '/placeholder-snapshot.jpg';
                      e.target.alt = 'Snapshot unavailable';
                    }}
                  />
                  <div className="snapshot-overlay">
                    <div className="similarity-badge">
                      {Math.round(result.similarity * 100)}% Match
                    </div>
                  </div>
                </div>
              </div>

              <div className="result-details">
                <div className="detail-section">
                  <h4>Similarity Score</h4>
                  <div className="similarity-score">
                    <div className="similarity-bar">
                      <div
                        className="similarity-fill"
                        style={{ width: `${result.similarity * 100}%` }}
                      ></div>
                    </div>
                    <span className="similarity-percentage">
                      {Math.round(result.similarity * 100)}%
                    </span>
                  </div>
                  <p className="similarity-help-text">
                    Higher scores indicate stronger visual or feature-based similarity
                  </p>
                </div>

                <div className="detail-section">
                  <h4>Supporting Evidence</h4>
                  <ul className="evidence-list">
                    {result.evidence.map((evidence, index) => (
                      <li key={index} className="evidence-item">
                        <span className="evidence-type">
                          {evidence.startsWith('visual') ? '📷' :
                           evidence.startsWith('rf') ? '📡' :
                           evidence.startsWith('radar') ? '📻' : '📄'}
                        </span>
                        <span className="evidence-id">{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Verification Status</h4>
                  <div className="verification-status">
                    <span className={`status-dot ${verifiedResults.has(result.id) ? 'status-online' : 'status-unknown'}`}></span>
                    <span>
                      {verifiedResults.has(result.id) ? 'Verified by Operator' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="verification-help-text">
                    Operator verification is required before results can be used for action
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="results-footer">
        <div className="verified-count">
          Verified: {Array.from(verifiedResults).length} / {results.length}
        </div>
        <div className="footer-actions">
          <button className="btn btn-secondary">
            Mark All as Reviewed
          </button>
          <button className="btn btn-primary ms-2">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};