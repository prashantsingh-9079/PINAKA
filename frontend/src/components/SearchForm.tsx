import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: { type: string; value: any }) => void;
  isSearching: boolean;
}

export const SearchForm = ({ onSearch, isSearching }: SearchFormProps) => {
  const [textQuery, setTextQuery] = useState('');
  const [colorValue, setColorValue] = useState('#ff0000');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSearch = () => {
    // Determine search type based on what's filled
    if (selectedFile) {
      onSearch({ type: 'image', value: selectedFile });
    } else if (textQuery.trim()) {
      onSearch({ type: 'text', value: textQuery.trim() });
    } else if (colorValue) {
      onSearch({ type: 'color', value: colorValue });
    }
    // Clear form after search
    setTextQuery('');
    setColorValue('#ff0000');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <form className="search-form" onSubmit={(e) => {
      e.preventDefault();
      handleSearch();
    }}>
      <div className="form-section">
        <h3>Search by Image</h3>
        <div className="image-upload">
          <label className="upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="upload-input"
            />
            {selectedFile ? (
              <div className="file-info">
                <span>Selected: {selectedFile.name}</span>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  e.target.value = ''; // Reset file input
                }}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📷</div>
                <p>Drag & drop or click to upload</p>
                <small>Supported: JPG, PNG</small>
              </div>
            )}
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </label>
        </div>
        <p className="form-help-text">
          Upload a reference image to search for visually similar objects
        </p>
      </div>

      <div className="form-section">
        <h3>Search by Text</h3>
        <div className="form-group">
          <label htmlFor="text-search">Object description or name</label>
          <input
            type="text"
            id="text-search"
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder="e.g., 'white drone with red markings'"
            className="form-input"
          />
        </div>
        <p className="form-help-text">
          Describe the object's appearance, markings, or known characteristics
        </p>
      </div>

      <div className="form-section">
        <h3>Search by Color</h3>
        <div className="color-picker">
          <label htmlFor="color-picker">Primary color</label>
          <input
            type="color"
            id="color-picker"
            value={colorValue}
            onChange={(e) => setColorValue(e.target.value)}
            className="form-input color-input"
          />
          <div className="color-preview" style={{ backgroundColor: colorValue }}></div>
        </div>
        <p className="form-help-text">
          Search for objects with prominent color matching the selected hue
        </p>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search Objects'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setTextQuery('');
            setColorValue('#ff0000');
            setSelectedFile(null);
            setPreviewUrl(null);
            e.target.value = ''; // Reset file input if any
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
};