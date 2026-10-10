# PINAKA Frontend

Frontend for the PINAKA multi-sensor AI platform for drone detection, tracking, and swarm analytics.

## Overview

This frontend implements the user interface specified in SOLUTION.md Section 24:
- Professional, modern UI with dark theme
- Responsive design with collapsible sidebar
- Real-time data visualization using Recharts
- Component-based architecture with React 18 and TypeScript
- State management via React hooks

## Enhanced System Health Section

The System Health section (`src/pages/SensorHealth.tsx`) has been enhanced with:

### SensorDetails Component
- Sensor-specific control buttons (Reset/Restart) based on sensor status
- Simulated sensor control actions

### SensorLatencyChart Component
- Sensor visibility toggles (show/hide specific sensors)
- Statistical summaries showing average latency for each sensor
- Dynamic chart rendering based on visible sensors

### SensorGrid Component
- Sensor grouping by type (camera, rf, radar, thermal)
- Health history tracking with trend indicators (↑ improving, → stable, ↓ degrading)
- Group statistics display

## Design System

Follows SOLUTION.md Section 24 UI design direction:
- Dark charcoal/navy base (#0a0e17)
- Cyan/blue telemetry accents (#00bcd4, #2196f3)
- Amber for degraded/uncertain states (#ffb300)
- Red for urgent attention (#f44336)
- Green for healthy/normal states (#4caf50)

## Components

### Pages
- `SensorHealth.tsx` - Main sensor health monitoring page
- `ObjectSearch.tsx` - Text-based object search using Gemma Flash
- `LiveMonitor.tsx` - Real-time tracking and event visualization
- `EventsAlerts.tsx` - Event and alert management
- `Evaluation.tsx` - System evaluation and testing

### Components
- `SensorGrid.tsx` - Sensor status display with grouping and health trends
- `SensorDetails.tsx` - Detailed sensor view with controls splitting.

## State Management

Uses React hooks (`useState`, `useEffect`) for:
- Real-time sensor data simulation
- Chart data updates
- UI state controls (visibility toggles, grouping)
- Form state in search and evaluation components

## Data Visualization

Built with Recharts library:
- Line charts for latency trends
- Responsive containers for adaptive sizing
- Custom tooltips and legends
- Threshold reference lines for performance metrics

## Real-time Simulation

Uses `setInterval` to simulate:
- Live sensor data updates (latency, health scores)
- Random status changes (online/degraded/offline)
- Historical data trending
- Event generation for alerts