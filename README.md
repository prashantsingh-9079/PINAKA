# PINAKA

**Multi-Sensor AI for Drone Detection, Tracking & Swarm Analytics**

Pinaka is a research-focused, operator-supervised platform that combines
computer vision with authorized RF, thermal, and radar observations to
support airborne-object detection, tracking, sensor fusion, and
group-motion analysis.

Inspired by the legendary bow associated with Lord Shiva, **Pinaka**
represents precision, awareness, and powerful technology.

## Key Features

# PINAKA

**Multi-Sensor AI for Drone Detection, Tracking & Swarm Analytics**

Pinaka is a research-focused, operator-supervised platform that combines
computer vision with authorized RF, thermal, and radar observations to
support airborne-object detection, tracking, sensor fusion, and
group-motion analysis.

Inspired by the legendary bow associated with Lord Shiva, **Pinaka**
represents precision, awareness, and powerful technology.

## Key Features

-   **Multi-sensor ingestion:** Camera/video, thermal, radar, and
    authorized RF-classifier observations.
-   **AI-assisted detection:** Identify candidate objects and preserve
    class probabilities and confidence.
-   **Tracking & trajectories:** Maintain track IDs, histories,
    snapshots, and motion estimates.
-   **Sensor fusion:** Align timestamped observations and combine
    evidence while preserving uncertainty.
-   **Swarm analytics:** Analyze candidate groups, group size,
    dispersion, clustering, and relative motion.
-   **Interactive graphs:** Speed/time, position/time, trajectory,
    confidence, group dispersion, sensor health, and latency.
-   **Reference-object search:** Search authorized snapshots using an
    image, colour, or text description, with human verification.
-   **Live dashboard:** Monitor tracks, sensor status, events, alerts,
    and evidence.
-   **Evaluation tools:** Compare vision-only and fused results using
    documented metrics.

## Technology Stack

-   **Frontend:** React, TypeScript, Recharts
-   **Backend:** Python, FastAPI, WebSockets
-   **AI & analytics:** OpenCV, PyTorch, NumPy, SciPy, scikit-learn
-   **Storage:** SQLite for the initial prototype

The exact stack may evolve as the prototype develops.

## Architecture

``` text
Camera / Thermal / Radar / Authorized RF Data
                    ↓
            Sensor Adapters
                    ↓
        Timestamping & Validation
                    ↓
       Detection + Sensor Fusion
                    ↓
          Tracking & Analytics
                    ↓
       FastAPI + WebSocket Stream
                    ↓
           Pinaka Dashboard
```

## Project Status

**In development.** The initial prototype can use replayed or simulated
data while sensor adapters, models, and synchronized datasets are
validated. Simulated results must be clearly labelled and must not be
presented as live sensor measurements.

## Safety & Responsible Use

Pinaka is designed for detection, analysis, simulation, and
human-reviewed situational awareness. It does not provide autonomous
weapon control, auto-aiming, interceptor guidance, or automatic target
engagement. Group-motion patterns are not proof of hostile intent. Use
only data and sensors you are authorized to access, and protect
collected imagery and records.

## Roadmap

-   [ ] Build the dashboard and simulated event stream
-   [ ] Add video ingestion and object tracking
-   [ ] Add RF/radar/thermal replay adapters and synchronization
-   [ ] Implement uncertainty-aware sensor fusion
-   [ ] Add trajectory graphs and group analytics
-   [ ] Add reference-object search and operator review
-   [ ] Evaluate performance on held-out data

## Name

**PINAKA** --- inspired by the legendary bow associated with Lord Shiva.

**Tagline:** *Detect. Understand. Protect.*
   **Multi-sensor ingestion:** Camera/video, thermal, radar, and
    authorized RF-classifier observations.
-   **AI-assisted detection:** Identify candidate objects and preserve
    class probabilities and confidence.
-   **Tracking & trajectories:** Maintain track IDs, histories,
    snapshots, and motion estimates.
-   **Sensor fusion:** Align timestamped observations and combine
    evidence while preserving uncertainty.
-   **Swarm analytics:** Analyze candidate groups, group size,
    dispersion, clustering, and relative motion.
-   **Interactive graphs:** Speed/time, position/time, trajectory,
    confidence, group dispersion, sensor health, and latency.
-   **Reference-object search:** Search authorized snapshots using an
    image, colour, or text description, with human verification.
-   **Live dashboard:** Monitor tracks, sensor status, events, alerts,
    and evidence.
-   **Evaluation tools:** Compare vision-only and fused results using
    documented metrics.

## Technology Stack

-   **Frontend:** React, TypeScript, Recharts
-   **Backend:** Python, FastAPI, WebSockets
-   **AI & analytics:** OpenCV, PyTorch, NumPy, SciPy, scikit-learn
-   **Storage:** SQLite for the initial prototype

The exact stack may evolve as the prototype develops.

## Architecture

``` text
Camera / Thermal / Radar / Authorized RF Data
                    ↓
            Sensor Adapters
                    ↓
        Timestamping & Validation
                    ↓
       Detection + Sensor Fusion
                    ↓
          Tracking & Analytics
                    ↓
           FastAPI + WebSocket Stream
                    ↓
           Pinaka Dashboard
```

## Project Status

**In development.** The initial prototype can use replayed or simulated
data while sensor adapters, models, and synchronized datasets are
validated. Simulated results must be clearly labelled and must not be
presented as live sensor measurements.

## Safety & Responsible Use

Pinaka is designed for detection, analysis, simulation, and
human-reviewed situational awareness. It does not provide autonomous
weapon control, auto-aiming, interceptor guidance, or automatic target
engagement. Group-motion patterns are not proof of hostile intent. Use
only data and sensors you are authorized to access, and protect
collected imagery and records.

## Roadmap

-   [ ] Build the dashboard and simulated event stream
-   [ ] Add video ingestion and object tracking
-   [ ] Add RF/radar/thermal replay adapters and synchronization
-   [ ] Implement uncertainty-aware sensor fusion
-   [ ] Add trajectory graphs and group analytics
-   [ ] Add reference-object search and operator review
-   [ ] Evaluate performance on held-out data

## Name

**PINAKA** --- inspired by the legendary bow associated with Lord Shiva.

**Tagline:** *Detect. Understand. Protect.*

