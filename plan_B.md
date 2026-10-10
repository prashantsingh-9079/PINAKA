# PINAKA Team Implementation Plan - Part B
## Backend-Specific Guidelines

## Context
PINAKA is a research-focused, operator-supervised Multi-Sensor AI platform for drone detection, tracking, and swarm analytics. This part focuses on backend-specific implementation guidelines for the Python/FastAPI service.

## Backend Implementation Guidelines

### Technology Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI for REST APIs and WebSocket streaming
- **API Validation**: Pydantic models for request/response validation
- **Real-time**: WebSocket connections for live data streaming to frontend
- **Database**: SQLite for initial prototype (designed for PostgreSQL adoption)
- **AI/ML**: PyTorch for model inference, OpenCV for video/frame processing
- **Numerical Computing**: NumPy and SciPy for calculations
- **Clustering**: scikit-learn or SciPy for group analytics
- **Graph Relationships**: NetworkX (only where beneficial for group analysis)

### Development Setup
- **Dependencies**: 
  - Python 3.11+, FastAPI, PyTorch, OpenCV, SQLite
  - Additional: Pytest, Uvicorn, Python-dotenv for environment variables
- **Environment**: 
  - Copy `.env.example` to `.env` and configure
  - Example variables: Database paths, API keys for authorized sensors, etc.
- **Installation**: 
  ```bash
  # In backend/ directory
  pip install -r requirements.txt
  ```
- **Development Commands**:
  - `uvicorn main:app --reload` - Start development server with hot reload
  - `python -m pytest` - Run test suite
  - `pip list --outdated` - Check for dependency updates

### Key Services to Implement
Based on SOLUTION.md architecture:

#### 1. Sensor Adapters Layer
- **Video Adapter**: Process camera/video feeds, normalize timestamps
- **RF Adapter**: Handle authorized RF classifier outputs  
- **Radar Adapter**: Process radar detection feeds
- **Thermal Adapter**: Process thermal camera feeds
- Each adapter must:
  - Start/stop streaming
  - Provide health checks
  - Read observations with uncertainty metrics
  - Output normalized format: `{timestamp, sensor_id, raw_data, uncertainty_metrics, health_status}`

#### 2. Per-Sensor Inference
- **Vision Module**: Object detection with class probabilities and confidence
- **RF Processing**: Classification confidence scoring
- **Radar Processing**: Detection filtering and tracking prep
- **Thermal Processing**: Heat signature analysis
- Requirements:
  - Uncertainty quantification alongside predictions (e.g., Monte Carlo dropout)
  - Maximum 50ms latency per sensor stream
  - Model cards documenting training data, limitations, failure modes

#### 3. Sensor Fusion Module
- **Timestamp Normalization**: Align observations from different sensors
- **Observation Association**: Compatible observation grouping without forced associations
- **Uncertainty-Aware Fusion**: Combine evidence while preserving uncertainty metrics
- **Output**: Fused estimates with covariance/uncertainty matrices

#### 4. Tracking Module
- **Multi-Object Tracking**: Maintain track IDs, histories, snapshots
- **Motion Estimation**: Kinematics and trajectory calculation
- **Uncertainty Propagation**: Kalman/particle filter-based uncertainty tracking
- **Track Lifecycle**: Tentative → Confirmed → Deleted based on evidence
- **Track Attributes**: ID, history, estimated motion, confidence, sensor provenance

#### 5. Analytics Layer
- **Per-Object Metrics**: Speed, acceleration, turning rate, etc.
- **Group-Level Analytics**: 
  - Group size, density, dispersion metrics
  - Clustering analysis (spatial/temporal)
  - Relative motion and swarm pattern detection
- **Uncertainty Visualization**: Confidence bands and probability distributions

#### 6. Events & Alerting
- **Alert Generation**: Based on motion anomalies, group behavior, or high uncertainty
- **Human Review Required**: All alerts require operator confirmation
- **Evidence Preservation**: Store raw sensor data contributing to alerts
- **Alert Lifecycle**: Generated → Under Review → Confirmed/Dismissed

#### 7. Persistence Layer
- **Database Schema**: Observations, tracks, groups, alerts, audit log
- **Query Optimization**: Time-series efficient queries for dashboard
- **Backup & Retention**: Configurable data retention policies

#### 8. Evaluation Framework
- **Offline Evaluation**: Compare vision-only vs. fused results
- **Metrics**: Detection accuracy, tracking precision, false positive/negative rates
- **Report Generation**: Automated evaluation reports

### Documentation Requirements
- Update OpenAPI/Swagger documentation for all API changes
- Document sensor-specific configuration and limitations
- Maintain backend architecture decision records (ADRs)
- Keep README.md updated with backend setup instructions
- Document API versioning and backward compatibility guidelines

### Testing Guidelines
- **Unit Testing**: Pytest with >80% coverage target
  - Test individual adapter functionality
  - Test inference uncertainty propagation
  - Test fusion association logic
  - Test tracking algorithms with synthetic data
- **Integration Testing**: 
  - Test API endpoints and WebSocket connections
  - Test end-to-end pipeline with synthetic sensor data
  - Test degraded mode operation (missing sensors)
- **Property-Based Testing**: 
  - Hypothesis for uncertainty monotonicity (more input uncertainty → more output uncertainty)
  - Invariant: system never reports certainty increase without evidence
- **Safety Testing**: 
  - Verify no autonomous weapon control features
  - Confirm human-in-the-loop workflows are required for alerts
  - Test degradation scenarios and fallback behaviors

### Code Standards
- **Linting**: Flake8 with project configuration, enforced via pre-commit
- **Type Hints**: Use Python 3.11+ typing features extensively
- **API Design**: Clear, versioned endpoints with comprehensive error handling
- **Module Organization**: Clear separation of concerns (ingestion, vision, fusion, tracking, etc.)
- **Error Handling**: Graceful degradation when sensors fail or data is incomplete
- **Logging**: Structured logging with appropriate log levels (debug, info, warn, error)
- **Security**: Input validation, protection against common vulnerabilities

---
*This is Part B of 3: Backend-specific implementation guidelines.
Continue with plan_A.md (Frontend) and plan_C.md (Team Collaboration & Processes) for the complete plan.*