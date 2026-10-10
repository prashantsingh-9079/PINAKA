import React, { useState } from 'react';
import { SearchForm } from '../components/SearchForm';
import { SearchResults } from '../components/SearchResults';

export const ObjectSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'image' | 'text' | 'color' | null>(null);

  const handleSearch = async (query: { type: string; value: any }) => {
    setSearchType(query.type as any);
    setIsSearching(true);

    // Simulate different search results based on type
    setTimeout(() => {
      let results: any[] = [];

      if (query.type === 'image') {
        results = [
          {
            id: 'img-result-1',
            timestamp: '2026-10-10T10:23:45Z',
            similarity: 0.92,
            snapshot: 'https://via.placeholder.com/320x240?text=Snapshot+1',
            trackId: 'TRK-001',
            evidence: ['visual-001', 'visual-002', 'rf-001']
          },
          {
            id: 'img-result-2',
            timestamp: '2026-10-10T10:22:12Z',
            similarity: 0.78,
            snapshot: 'https://via.placeholder.com/320x240?text=Snapshot+2',
            trackId: 'TRK-005',
            evidence: ['visual-003', 'rf-002']
          }
        ];
      } else if (query.type === 'text') {
        results = [
          {
            id: 'txt-result-1',
            timestamp: '2026-10-10T10:25:30Z',
            similarity: 0.85,
            snapshot: 'https://via.placeholder.com/320x240?text=Text+Match+1',
            trackId: 'TRK-002',
            evidence: ['visual-004', 'rf-001', 'metadata-001']
          },
          {
            id: 'txt-result-2',
            timestamp: '2026-10-10T10:21:05Z',
            similarity: 0.63,
            snapshot: 'https://via.placeholder.com/320x240?text=Text+Match+2',
            trackId: null,
            evidence: ['metadata-002']
          }
        ];
      } else if (query.type === 'color') {
        results = [
          {
            id: 'col-result-1',
            timestamp: '2026-10-10T10:24:15Z',
            similarity: 0.91,
            snapshot: 'https://via.placeholder.com/320x240?text=Color+Match+1',
            trackId: 'TRK-003',
            evidence: ['visual-005', 'visual-006']
          },
          {
            id: 'col-result-2',
            timestamp: '2026-10-10T10:19:40Z',
            similarity: 0.76,
            snapshot: 'https://via.placeholder.com/320x240?text=Color+Match+2',
            trackId: 'TRK-007',
            evidence: ['visual-007', 'rf-003']
          },
          {
            id: 'col-result-3',
            timestamp: '2026-10-10T10:17:20Z',
            similarity: 0.68,
            snapshot: 'https://via.placeholder.com/320x240?text=Color+Match+3',
            trackId: null,
            evidence: ['rf-004']
          }
        ];
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 1500); // Slightly longer delay for realism
  };

  return (
    <div className="object-search-page">
      <div className="page-header">
        <h1>Reference Object Search</h1>
        <p className="page-subtitle">
          Search for previously detected objects using image, text, or color
        </p>
      </div>

      <div className="search-content">
        <div className="search-sidebar">
          <SearchForm
            onSearch={handleSearch}
            isSearching={isSearching}
          />
        </div>
        <div className="search-main">
          {isSearching ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Searching authorized snapshots...</p>
              <p className="search-type">
                Searching by {searchType === 'image' ? 'image' : searchType === 'text' ? 'text description' : 'color'}
              </p>
            </div>
          ) : (
            <SearchResults
              results={searchResults}
              query={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};