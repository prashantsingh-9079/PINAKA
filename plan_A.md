# PINAKA Team Implementation Plan - Part A
## Frontend-Specific Guidelines

## Context
PINAKA is a research-focused, operator-supervised Multi-Sensor AI platform for drone detection, tracking, and swarm analytics. This part focuses on frontend-specific implementation guidelines for the React/TypeScript dashboard.

## Frontend Implementation Guidelines

### Technology Stack
- **Framework**: React 18 + TypeScript 5.0
- **Build Tool**: Vite (for development)
- **State Management**: React context or Zustand (if complexity justifies)
- **Charts**: Recharts for time-series and comparison charts
- **Real-time Updates**: WebSocket client for live data streaming
- **UI Framework**: Responsive design with loading/disconnected/degraded/error states

### Development Setup
- **Dependencies**: 
  - React, TypeScript, Recharts, Vite
  - Additional: Jest, React Testing Library for testing
- **Installation**: 
  ```bash
  # In frontend/ directory
  npm install  # or yarn install
  ```
- **Development Commands**:
  - `npm run dev` - Start development server with hot reload
  - `npm run build` - Build for production
  - `npm run test` - Run unit tests
  - `npm run lint` - Run ESLint

### Key Components to Implement
Based on SOLUTION.md architecture:
- **Dashboard Layout**: Main interface showing tracks, sensor status, events, alerts
- **Interactive Graphs**: 
  - Speed/time, position/time, trajectory plots
  - Confidence intervals and uncertainty visualization
  - Group dispersion and sensor health metrics
  - Latency monitoring charts
- **Map/Image Overlays**: Geospatial visualization of tracks and detections
- **Reference-Object Search**: 
  - Image upload interface
  - Color picker/search
  - Text description input
  - Results display with human verification workflow
- **Live Monitoring Panels**:
  - Track list with ID, classification, confidence
  - Sensor status indicators (health, latency, data rate)
  - Event and alert history with filtering
  - Group analytics and swarm behavior visualization
- **Operator Review Workflow**:
  - Alert acknowledgment and annotation
  - Evidence review (raw sensor data contributing to alerts)
  - False positive marking and feedback

### Documentation Requirements
- Update component documentation for all UI changes
- Document sensor-specific visualization requirements
- Maintain frontend architecture decision records (ADRs)
- Keep README.md updated with frontend setup instructions
- Document browser compatibility and performance considerations

### Testing Guidelines
- **Unit Testing**: Jest + React Testing Library for component logic
- **Integration Testing**: Test WebSocket connections and data flow
- **End-to-End Testing**: Cypress for critical user journeys (alert response, search workflow)
- **Visual Regression Testing**: For UI consistency across changes
- **Performance Testing**: Monitor frame rates and memory usage during visualization

### Code Standards
- **Linting**: ESLint with Airbnb or standard configuration, enforced via pre-commit
- **TypeScript**: Strict type checking, avoid `any` where possible
- **Component Design**: Reusable, composable components with clear props interfaces
- **State Management**: Clear separation of concerns, minimal global state
- **Error Handling**: Graceful degradation when WebSocket disconnects or data is incomplete

---
*This is Part A of 3: Frontend-specific implementation guidelines.
Continue with plan_B.md (Backend) and plan_C.md (Team Collaboration & Processes) for the complete plan.*