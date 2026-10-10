# PINAKA Backend

Backend API for the PINAKA multi-sensor AI platform for drone detection, tracking, and swarm analytics.

## Architecture Overview

This backend implements the architecture specified in SOLUTION.md Sections 16-20:

### Core Components

1. **Sensor Adapters & Ingestion** (`app/ingestion/`)
   - Handles real-time data from multiple sensor types (camera, RF, radar, thermal)
   - Timestamp normalization and buffering

2. **Per-Sensor Inference** (`app/vision/`)
   - Object detection using computer vision models (YOLO-style as per SOLUTION.md Section 9)
   - Note: Gemma Flash is NOT used for vision detection - it's used for text processing tasks

3. **Observation Association & Fusion** (`app/fusion/`)
   - Combines detections from multiple sensors
   - Handles sensor-specific uncertainties and latencies

4. **Multi-Object Tracking** (`app/tracking/`)
   - Maintains object tracks over time
   - Handles occlusions and sensor handoffs

5. **Event/Alert Engine** (`app/events/`)
   - Detects significant events based on tracks and behaviors
   - Generates alerts for drone detection, swarm behavior, etc.

6. **API & WebSocket Layer** (`app/api/`)
   - RESTful API for configuration and querying
   - WebSocket streaming for real-time data (Section 16)
   - Includes Gemma Flash integration for text-based tasks

### Gemma Flash Integration

Gemma Flash (a language model) is specifically used for:
- **Text-based Object Search** (Section 14): Processing natural language search queries
- **Event Explanations**: Generating natural language descriptions of alerts/events
- **Search Query Understanding**: Extracting intent and attributes from text descriptions

It is NOT used for:
- Primary vision detection (uses proper CV models like YOLO)
- Sensor data processing
- Tracking algorithms
- Fusion logic

### API Endpoints

Following SOLUTION.md Section 16:
- `GET /api/health/` - Health check
- `GET /api/sensors/` - Sensor status and metadata
- `GET /api/tracks/` - Active tracks
- `GET /api/groups/` - Detected groups/swarms
- `GET /api/events/` - Alerts and events
- `POST /api/search/text` - Text-based object search (uses Gemma Flash)
- `POST /api/search/image` - Image-based object search
- `POST /api/search/color` - Color-based object search
- `WebSocket /ws` - Real-time data streaming

## Installation

```bash
# Install dependencies
pip install -e .

# Set up environment variables (copy .env.example to .env)
cp .env.example .env

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

See `.env.example` for required configuration including:
- Gemma Flash model settings
- Database connections
- Redis configuration
- File upload limits

## Testing

```bash
# Run tests
pytest tests/

# Run specific test
pytest tests/test_main.py -v
```

## Design Decisions Regarding Gemma Flash

While the user requested to "use gemma flash as api provider", careful consideration of the SOLUTION.md architecture shows that:

1. **Vision Detection** requires specialized computer vision models (Section 9 specifies object detection models)
2. **Gemma Flash** excels at language understanding and generation
3. **Appropriate Use Cases**:
   - Processing text queries in Object Search (Section 14)
   - Generating natural language explanations for events/alerts
   - Supporting the reference-object search via text prompts
   - Potential use in evaluation reporting for natural language summaries

This maintains architectural integrity while incorporating the requested Gemma Flash capability where it adds genuine value.