# SOLUTION.md --- Multi-Sensor Drone Detection, Tracking & Swarm Analytics

> **Purpose:** Implementation specification for Claude Code. Build a
> research-grade, operator-supervised prototype that ingests authorized
> sensor observations, synchronizes evidence, detects and tracks
> airborne objects, performs group-motion analytics, and visualizes
> results in a real-time dashboard.
>
> **Safety scope:** This specification covers sensing, observation
> fusion, tracking, analytics, simulation, alerting, and reporting. It
> does not implement autonomous weapon control, real-world auto-aiming,
> target-engagement instructions, or guidance of an interceptor toward a
> person or object. Any response-planning module is limited to
> non-kinetic, simulated, human-reviewed safety workflows.

## 1. Product vision

Build a modular application that turns heterogeneous sensor data into a
time-aligned, uncertainty-aware operational picture.

The system must not treat a single sensor as ground truth. It should
maintain separate sensor observations, associate observations only when
evidence supports the association, estimate tracks over time, and
display both the result and its uncertainty.

### Main outcomes

1.  Detect candidate airborne objects in video.
2.  Ingest authorized RF classification outputs and radar/thermal
    observations when available.
3.  Synchronize observations using timestamps and compensate for known
    sensor clock offsets.
4.  Associate compatible observations with candidate tracks without
    forcing an association.
5.  Maintain track IDs, history, estimated motion, confidence, and
    sensor provenance.
6.  Calculate per-object motion metrics and group-level spatial/motion
    statistics.
7.  Present synchronized graphs, map/image overlays where suitable,
    sensor health, alerts, and event history.
8.  Support reference-object search using a supplied image, colour, or
    textual description, with human confirmation.
9.  Evaluate vision-only, RF-only, and fused results on held-out test
    data.
10. Operate in degraded modes when sensors or services are missing.

## 2. Core principles

-   **Evidence before conclusions:** Store raw observations and model
    outputs separately from fused estimates.
-   **Uncertainty is first-class:** Every estimate should include a
    confidence/quality indicator and, where possible, uncertainty
    bounds.
-   **Unknown is a valid result:** Do not force unfamiliar objects into
    a known class.
-   **No sensor does not mean no object:** RF silence, camera
    obstruction, or radar unavailability must never be interpreted as
    proof that the area is clear.
-   **Human review:** High-impact alerts require operator review and an
    evidence trail.
-   **No intent inference from motion alone:** Group movement is a
    measurable pattern, not proof of malicious intent.
-   **Reproducibility:** Keep model versions, configuration, dataset
    provenance, and evaluation results.
-   **Graceful degradation:** A missing sensor must not crash the
    pipeline.
-   **Privacy and authorization:** Use only legally authorized imagery
    and RF data, with access controls and retention limits.
-   **Separate measurement from display:** Graphs should show units,
    time basis, missing values, and whether values are measured or
    estimated.

## 3. User roles and workflows

### Operator

-   Opens the live dashboard.
-   Sees active sensors, detections, tracks, uncertainty, and event
    history.
-   Selects a track to inspect its snapshots, trajectory, motion charts,
    and contributing sensor observations.
-   Reviews, dismisses, annotates, or confirms an alert.
-   Searches for a reference object using an uploaded image, colour, or
    text description.
-   Exports a report for a selected time range.

### Researcher / administrator

-   Configures dataset and model versions.
-   Runs offline evaluation and simulation.
-   Compares sensor baselines and fusion variants.
-   Reviews false positives, missed detections, track fragmentation, and
    latency.
-   Manages authorized users and data-retention settings.

## 4. Scope and explicit non-goals

### In scope

-   Camera/video object detection and visual multi-object tracking.
-   Ingestion of preprocessed, authorized RF classifier outputs.
-   Ingestion of radar and thermal detections when available.
-   Timestamp alignment, observation association, uncertainty-aware
    fusion.
-   Track history and kinematic estimates.
-   Group clustering and coordinated-motion indicators.
-   Dashboard graphs, alerts, report generation, and simulation.
-   Reference-image similarity search with operator confirmation.
-   Test harnesses and performance measurements.

### Out of scope

-   Autonomous weapon or interceptor control.
-   Auto-aiming, firing solutions, or real-world target-engagement
    coordinates.
-   Guidance that directs an interceptor toward a detected object.
-   Unlawful interception, jamming, or unauthorized RF collection.
-   Claims of reliable hostile-intent classification from appearance or
    motion.
-   Treating a model prediction as a verified fact without evidence.

For a demonstration of response planning, provide a **simulation-only,
non-kinetic response-priority panel** (for example: inspect, verify
sensor, notify operator, or review a simulated safe-zone status). It
must not output weapon instructions or physical interception guidance.

## 5. High-level architecture

``` text
Authorized Sensor Inputs
  ├── RGB / video camera
  ├── Thermal camera
  ├── Radar detection feed
  └── RF classifier output / authorized RF metadata
             │
             ▼
     Sensor Adapters / Ingestion
             │
             ▼
 Timestamp normalization + validation
             │
             ▼
 Per-sensor inference / observation normalization
             │
             ▼
 Observation association + uncertainty-aware fusion
             │
             ▼
 Multi-object tracking + track history
             │
             ├──────────────► Motion analytics
             │                  ├── per-track kinematics
             │                  ├── group clustering
             │                  └── swarm-pattern indicators
             ▼
 Event / alert engine
             │
             ▼
 FastAPI backend ── WebSocket event stream ── React dashboard
             │
             └── evaluation, audit log, reports
```

Use modular interfaces so each sensor adapter can be tested
independently. Do not require every sensor to be present to start the
application.

## 6. Recommended technology stack

### Frontend

-   React + TypeScript.
-   Vite for development.
-   Recharts for time-series and comparison charts.
-   A lightweight state-management approach (React context or Zustand if
    state complexity justifies it).
-   WebSocket client for live updates.
-   Responsive layout with clear loading, disconnected, degraded, and
    error states.

### Backend

-   Python 3.11+.
-   FastAPI for REST APIs and WebSocket streaming.
-   Pydantic models for validated messages.
-   NumPy and SciPy for numerical operations.
-   OpenCV for video/frame handling.
-   PyTorch for model inference where a model is available.
-   A tracker interface that can initially use a simple
    Kalman-filter-based estimator and a transparent association method.
-   scikit-learn or SciPy for clustering.
-   NetworkX only where graph-based group relationships add value.
-   SQLite for a local MVP; design repository interfaces so PostgreSQL
    can be adopted later.
-   Pytest for unit and integration tests.

### Optional later additions

-   Redis or a message broker only if measured throughput requires it.
-   Object storage for large video/snapshot assets.
-   Docker Compose for reproducible development.
-   A dedicated model-serving process if inference blocks API
    responsiveness.

Avoid adding infrastructure before the single-machine MVP works.

## 7. Data contracts

All modules must exchange typed, versioned records. Use UTC timestamps
internally and preserve original sensor timestamps for auditing.

### 7.1 Sensor observation

Suggested normalized schema:

``` json
{
  "schema_version": "1.0",
  "observation_id": "uuid",
  "sensor_id": "camera-01",
  "sensor_type": "vision",
  "timestamp_utc": "2026-10-10T10:00:00.000Z",
  "timestamp_source": "sensor",
  "clock_offset_ms": 0,
  "class_label": "drone",
  "class_probabilities": {"drone": 0.82, "bird": 0.12, "unknown": 0.06},
  "confidence": 0.82,
  "image_bbox": {"x": 100, "y": 80, "width": 42, "height": 36},
  "position": null,
  "position_frame": "image_pixels",
  "quality": {"blur_score": null, "sensor_health": "ok"},
  "asset_uri": null,
  "model_version": "vision-model-version",
  "metadata": {}
}
```

This is an illustrative contract. Use `null` for unavailable values
rather than inventing them. For radar or other calibrated sensors,
`position` must include coordinate-frame metadata and units. Never
combine pixel coordinates and physical-world coordinates as if they were
interchangeable.

### 7.2 Track state

A track should include: - `track_id` - `first_seen`, `last_seen` -
`state`: tentative, confirmed, coasting, lost, closed -
`class_distribution` - `state_estimate` - `coordinate_frame` and units -
`uncertainty` or covariance when available -
`contributing_observation_ids` - `sensor_sources` - `history` -
`track_quality` - `model_and_config_versions`

### 7.3 Group event

A group event should include: - `group_id` - timestamp/window - member
track IDs - clustering method and parameters - group size - dispersion
metric and its units - group-centroid estimate where coordinate frames
permit it - group-motion summary - quality/uncertainty - reason codes
and supporting measurements - `review_status`

### 7.4 Alert event

Alerts must include severity, trigger reason, evidence references,
timestamp, uncertainty, and review state. Avoid labels that imply
hostile intent. Prefer terms such as `unusual_group_motion`,
`sensor_disagreement`, `track_lost`, or `needs_operator_review`.

## 8. Sensor ingestion and synchronization

### Adapter interface

Each adapter should expose a common interface: - `start()` - `stop()` -
`health()` - `read_observations()` - `get_configuration()`

Implement the first MVP adapters as: 1. Video file / webcam adapter. 2.
JSON/CSV replay adapter for preprocessed RF outputs. 3. JSON/CSV replay
adapter for radar detections. 4. Optional thermal-video adapter using
the same image interface.

For the MVP, RF/radar can be replayed from authorized sample data. The
app must clearly label replay/simulated data and must not pretend that a
connected physical sensor exists.

### Synchronization rules

-   Normalize timestamps to UTC.
-   Preserve raw timestamp, source clock, and measured offset.
-   Define a configurable association time window.
-   Do not silently associate observations outside the configured time
    tolerance.
-   If timestamps are absent or unreliable, mark synchronization quality
    as degraded.
-   Handle out-of-order observations with a bounded reorder buffer.
-   Expose per-sensor lag and last-message time on the dashboard.
-   Never imply that nearest timestamps alone prove that two detections
    represent the same object.

### Missing or degraded sensors

When a sensor stops reporting: - Update its status to degraded/offline
after a configurable timeout. - Continue processing remaining sensors. -
Lower or adjust confidence only according to a documented fusion
policy. - Show which modalities contributed to every fused result. - Do
not treat missing RF as a negative RF detection unless the sensor was
actually operating and the classifier explicitly returned a valid
negative result.

## 9. Vision detection and tracking

### Vision pipeline

1.  Read frame and timestamp.
2.  Preprocess frame.
3.  Run an object detector if model weights are configured.
4.  Return class, confidence, bounding box, frame timestamp, and model
    version.
5.  Associate detections with existing visual tracks.
6.  Update trajectory history and track state.
7.  Publish a normalized observation and track update.

### Model strategy

-   Start with a pretrained detector that is licensed for the intended
    use.
-   Keep the detector behind a replaceable interface.
-   Do not claim that a generic pretrained model is reliable for tiny
    distant drones without evaluation.
-   Provide a clearly labelled demo mode with synthetic/sample
    detections if weights or suitable data are unavailable.
-   Record false positives such as birds, kites, aircraft, and
    background objects in the test set.
-   Support an `unknown` class and confidence threshold configuration.

### Tracking

Use a transparent baseline: - Kalman filter for state prediction where
the motion model and coordinates support it. - A documented association
method for matching detections to tracks. - Track lifecycle states:
tentative, confirmed, coasting, lost, closed. - Track IDs should persist
across short gaps when supported by the tracker, but the UI must show
uncertainty after missed detections. - Do not claim cross-camera
identity continuity unless calibrated geometry or a validated
re-identification method supports it.

### Snapshot handling

-   Capture a frame crop when a detection passes configured rules.
-   Store a timestamp and associated observation/track ID.
-   Apply configurable retention.
-   Avoid saving every frame by default.
-   Display the source and timestamp next to each snapshot.

## 10. RF, thermal, and radar inputs

The fusion service should consume **normalized observations**, not
depend directly on one vendor's hardware SDK.

### RF

-   Begin with public or authorized recordings and precomputed
    classifier outputs.
-   Keep signal-processing and classification code in a separate module.
-   Return class probabilities, sample-window timestamps, sensor
    identity, and quality flags.
-   Include unknown/background classes and evaluate out-of-distribution
    behavior.
-   An RF classification result is evidence of a signal pattern, not
    proof of a visually detected object.

### Thermal

-   Treat thermal detections as a separate modality with its own
    calibration and quality.
-   Record frame timestamps, bounding boxes, and confidence.
-   Account for resolution, environmental conditions, and calibration
    limitations.

### Radar

-   Normalize detections with timestamps, range/angle or position
    estimates where legitimately available, coordinate frame, units, and
    uncertainty.
-   Do not assume that radar coordinates are aligned with camera pixels.
-   Calibration/registration must be explicitly configured and validated
    before cross-modal spatial association.

## 11. Sensor fusion

### MVP: late fusion

Start with late fusion: each modality produces observations
independently; a fusion layer compares compatible observations and
combines evidence only when timing, geometry, class evidence, and sensor
quality support it.

This is easier to debug than an end-to-end multimodal neural network and
allows a credible baseline when training data is limited.

### Fusion stages

1.  Validate observation schema and timestamp.
2.  Calculate temporal compatibility.
3.  Check coordinate-frame compatibility where spatial matching is
    attempted.
4.  Generate candidate observation-to-track associations.
5.  Score associations using available evidence and uncertainty.
6.  Accept, reject, or leave association unresolved.
7.  Update the track estimate and evidence provenance.
8.  Publish a fused update with a reason summary.

### Required behaviors

-   Never force every RF observation to match a visual detection.
-   Permit `unassociated_rf_event` and `unassociated_visual_detection`.
-   Record conflicting evidence rather than hiding it.
-   Handle missing modalities without crashing.
-   Avoid double-counting correlated evidence.
-   Calibrate probabilities on held-out data; do not interpret raw model
    confidence as a calibrated probability by default.
-   Keep the fusion algorithm replaceable and benchmarkable.

### Baseline comparisons

Evaluate these variants on the same held-out sessions: - Vision only. -
RF classifier only (signal-event classification metrics). - Vision + RF
late fusion. - Vision + RF with sensor-quality features. - Additional
radar/thermal variants when data exists.

Fusion is considered useful only if it improves a relevant metric
without unacceptable increases in false alarms or latency.

## 12. Motion estimation and mathematical analytics

Every chart must specify units, coordinate frame, time basis, and
whether values are measured or estimated. Do not calculate physical
speed from image pixels unless camera calibration, object geometry, or a
validated mapping makes that estimate meaningful.

### Per-track calculations

For valid timestamped positions: - Time delta: `dt = t[i] - t[i-1]`. -
Displacement: Euclidean distance between consecutive positions in the
same coordinate frame. - Speed estimate: displacement divided by `dt`,
only if `dt > 0` and the coordinate units are physical. - Acceleration
estimate: change in estimated velocity divided by `dt`, with smoothing
and quality checks. - Heading/direction: derived only where the
coordinate system and displacement support it. - Trajectory smoothing:
use a documented filter; retain raw observations separately.

Guard against: - zero or negative time deltas, - large timestamp gaps, -
coordinate-frame changes, - implausible jumps, - noisy position
estimates, - missing points.

When data is image-only, show pixel displacement or image-plane motion
and label it clearly. Do not present it as metres/second.

### Required graphs

1.  **Speed vs time** --- physical units only for calibrated physical
    coordinates; otherwise image-plane displacement rate.
2.  **Position X vs time** --- state coordinate and units.
3.  **Position Y vs time** --- state coordinate and units.
4.  **Acceleration vs time** --- only when the input quality supports
    it.
5.  **Trajectory plot** --- 2D path with time-ordered points, track ID,
    start/end markers, and uncertainty where available.
6.  **Confidence vs time** --- detector/fusion confidence, with the
    source of confidence identified.
7.  **Detection count vs time** --- count by class and sensor.
8.  **Track lifecycle timeline** --- first seen, gaps, reacquisition,
    and lost/closed states.
9.  **Sensor latency / ingestion lag vs time**.
10. **Sensor health timeline** --- online, degraded, offline.
11. **Class probability chart** --- show alternatives, not just top
    class.
12. **Fusion evidence timeline** --- visual/RF/radar/thermal
    observations contributing to each update.

### Group-level graphs

1.  **Group size vs time** --- number of tracks in each candidate group.
2.  **Dispersion vs time** --- for physical coordinates, use a
    documented metric such as RMS distance from the group centroid; for
    image-only data, label as pixel dispersion.
3.  **Group centroid trajectory** --- only when all member positions
    share a compatible coordinate frame.
4.  **Relative-motion summary** --- member velocity similarity and
    direction spread, with uncertainty.
5.  **Inter-object distance distribution** --- label units and sample
    count.
6.  **Cluster membership timeline** --- when tracks enter or leave a
    candidate group.
7.  **Group confidence / stability vs time** --- based on documented,
    testable rules.
8.  **Group size distribution** --- counts of candidate groups by size.
9.  **False-group review chart** --- operator-confirmed versus rejected
    group events.

### Evaluation graphs

-   Confusion matrix.
-   Precision/recall curves where applicable.
-   Precision, recall, and false alarms per hour.
-   Macro-F1 for classification.
-   Tracking metrics over test sessions.
-   Latency percentiles (p50, p95, p99).
-   Throughput/FPS over time.
-   Performance by environment, weather/illumination, object size, and
    sensor availability.
-   Baseline comparison for vision-only, RF-only, and fusion.
-   Confidence calibration plot.

### Chart UX requirements

-   Shared time-range selector across synchronized charts.
-   Hover tooltip with timestamp, value, units, track ID, and source.
-   Legend and sensor filters.
-   Clear no-data and degraded-data states.
-   Click a track in one panel to select it across other panels.
-   Do not draw interpolated values as measured values.
-   Allow export of chart data to CSV and report images where practical.

## 13. Group and swarm analytics

Use the term **candidate group** unless the grouping has passed a
defined validation rule. A cluster is a mathematical grouping, not proof
of coordination or hostile intent.

### Candidate grouping

-   Group tracks using a configurable spatial and/or motion feature
    vector.
-   Possible baseline: DBSCAN for spatial clustering, provided the
    coordinate frame and units are valid.
-   For image-only tracks, use image-plane clustering and label its
    limitations.
-   Do not mix physical distances with pixel distances.
-   Allow a minimum group size and persistence window.
-   Preserve group membership history instead of recomputing the UI from
    only the latest frame.
-   Use temporal stability to reduce flickering clusters, while keeping
    the raw clustering result available for debugging.

### Group features

-   Number of active tracks.
-   Centroid and dispersion.
-   Mean and spread of speed estimates.
-   Direction similarity.
-   Relative distance statistics.
-   Track entry/exit count over a time window.
-   Fraction of tracks with valid estimates.
-   Sensor support and uncertainty.

### Alerts

Possible rules-based alerts: - `candidate_group_detected` -
`group_size_changed` - `unusual_dispersion_change` -
`sensor_disagreement` - `multiple_tracks_lost` - `sensor_degraded` -
`insufficient_evidence`

Each alert must include a reason, supporting observations,
thresholds/configuration, uncertainty, and review status. Use
configurable thresholds and validate them against benign group flights,
birds, and other confounders. Do not automatically label a group as
hostile.

## 14. Reference-object search

Support three search inputs: 1. Uploaded reference image. 2. Text
description/object name. 3. Colour selection or colour description.

### Safe, explainable behavior

-   Search only within authorized frames/snapshots available to the
    application.
-   Use colour as a weak filter, not a unique identity claim.
-   For image search, use visual similarity embeddings if a suitable
    licensed model is configured; otherwise provide a basic
    image-similarity or metadata-based demo and label it accurately.
-   Text prompts should not be treated as guaranteed object recognition.
-   Return candidate matches with timestamp, snapshot, track ID (if
    assigned), similarity/confidence score, and explanation of available
    evidence.
-   Require operator confirmation before marking a match as verified.
-   Support false-match feedback to improve evaluation.
-   Do not create a feature that automatically designates the matched
    object for engagement or interception.

## 15. Dashboard information architecture

### Main navigation

-   Overview
-   Live Monitor
-   Tracks
-   Group Analytics
-   Sensor Health
-   Object Search
-   Events & Alerts
-   Evaluation
-   Reports
-   Settings

### Overview

Show: - active sensors and their health, - active track count, -
candidate group count, - latest reviewed/unreviewed alerts, - end-to-end
update latency, - recent event timeline, - clear indicators for
replay/demo data versus live data.

### Live Monitor

-   Video frame with bounding boxes.
-   Track ID, class, confidence, timestamp.
-   Sensor source badges.
-   Track history/trajectory panel.
-   Snapshot capture and event annotation.
-   Connection and frame-rate status.

### Track detail

-   Current state and last-seen time.
-   Class distribution.
-   Observation history by sensor.
-   Snapshot gallery.
-   Trajectory and motion graphs.
-   Confidence/uncertainty timeline.
-   Lifecycle state and gaps.
-   Export track evidence.

### Group Analytics

-   Candidate group list.
-   Group membership and timeline.
-   Size, dispersion, centroid path, relative-motion charts.
-   Rule explanation and review actions.
-   Clearly visible warning that group patterns do not determine intent.

### Sensor Health

-   Last observation time.
-   Ingestion lag.
-   Processing rate.
-   Error rate.
-   Calibration/synchronization status.
-   Online/degraded/offline state.

### Events & Alerts

-   Filter by time, severity, sensor, track, group, and review state.
-   Show evidence and reason codes.
-   Operator actions: confirm observation, mark false positive,
    annotate, dismiss, or request further review.
-   Audit all state changes.

### Reports

Generate a report for a selected interval: - executive summary, - sensor
availability, - track/group event timeline, - key graphs, - reviewed
alerts, - evaluation limitations, - model/config versions, - data
provenance. Reports must distinguish measured values, estimates, and
simulation data.

## 16. Backend API plan

Use `/api/v1` versioning. Define request/response schemas in Pydantic
and document them through FastAPI OpenAPI.

Suggested endpoints: - `GET /api/v1/health` --- backend health. -
`GET /api/v1/sensors` --- sensor status. - `GET /api/v1/tracks` ---
current tracks with pagination/filtering. -
`GET /api/v1/tracks/{track_id}` --- track detail. -
`GET /api/v1/tracks/{track_id}/history` --- timestamped history. -
`GET /api/v1/groups` --- current candidate groups. -
`GET /api/v1/groups/{group_id}` --- group details/history. -
`GET /api/v1/events` --- alert/event history. -
`POST /api/v1/events/{event_id}/review` --- operator review action. -
`POST /api/v1/search/reference` --- authorized
reference-image/text/colour search. - `GET /api/v1/evaluation/runs` ---
evaluation history. - `POST /api/v1/evaluation/runs` --- start an
offline evaluation. - `GET /api/v1/reports/{report_id}` --- report
metadata/download information. - `WS /api/v1/stream` --- live track,
sensor, group, and alert updates.

Keep heavy inference and evaluation out of synchronous API request
handlers. Use a background worker/task queue only if needed; for the
MVP, a bounded in-process queue is acceptable.

## 17. WebSocket event contract

Use a discriminated event type: - `sensor_status` -
`observation_created` - `track_updated` - `track_closed` -
`group_updated` - `alert_created` - `pipeline_metrics`

Each event must contain: - schema version, - event ID, - UTC
timestamp, - event type, - payload, - data mode (`live`, `replay`, or
`simulation`).

Add reconnect handling, heartbeat, bounded queues, and client-side
stale-data indicators. Do not let a slow browser client block sensor
ingestion.

## 18. Persistence and audit

MVP persistence can use SQLite. Suggested entities/tables: - sensors -
observations - tracks - track_points - groups -
group_membership_events - alerts - operator_reviews - model_versions -
evaluation_runs - audit_log

Large media should be stored as files/object assets with metadata in the
database, not as large database blobs by default.

Requirements: - Database migrations or versioned schema setup. - UTC
timestamps. - Configurable retention and deletion. - Access control for
sensitive imagery and logs. - Audit records for review decisions and
configuration changes. - Do not log credentials or sensitive raw data
unnecessarily.

## 19. Data and training strategy

A vision dataset alone cannot train a genuine RF--vision fusion model.
The fusion model requires appropriately synchronized, labelled
observations or a carefully scoped late-fusion baseline.

Potential research starting points supplied for investigation: -
**VisDrone:** aerial imagery and annotations for visual
detection/tracking; not a synchronized RF--vision dataset. -
**DroneRF:** RF recordings for limited drone types/operating conditions;
assess the dataset paper and license before use. - **RFVS:** potentially
relevant RF--vision aligned samples; verify repository contents,
annotations, licensing, and synchronization details. -
**Time-Synchronized Multi-Sensor Drone Dataset (2026):** radar/RF
modalities as described in its publication; verify access conditions and
actual sensor modalities before relying on it.

Do not assume that a dataset exists, is downloadable, is suitable, or is
licensed for the project until verified.

### Dataset records should include

-   sensor timestamp and clock metadata,
-   sensor type/configuration,
-   label and label provenance,
-   object/track identity when available,
-   environment and recording session,
-   sensor health and missing-data indicators,
-   confidence/annotation quality,
-   train/validation/test assignment.

### Evaluation split

Split by recording session, site, or environment---not by randomly
distributing adjacent video frames. This reduces leakage and overly
optimistic scores.

Include: - drones and non-drone confounders, - different lighting and
weather where available, - single and multiple objects, - occlusions and
missed detections, - RF-active and RF-silent conditions where
available, - benign group flights, - sensor dropout and synchronization
errors.

If synchronized multimodal labels are unavailable, do not claim that the
fusion model was trained end-to-end. Build the fusion interface, test it
with replay/synthetic aligned events, and label those results as
simulation.

## 20. Testing and evaluation

### Unit tests

-   timestamp normalization and clock offsets,
-   schema validation,
-   coordinate-frame mismatch rejection,
-   zero/negative time delta handling,
-   track lifecycle transitions,
-   group metric calculations,
-   sensor timeout and reconnect behavior,
-   confidence and missing-data handling,
-   API input validation.

### Integration tests

-   video replay creates observations and tracks,
-   RF replay events appear in the event timeline,
-   compatible observations can be associated,
-   incompatible observations remain unassociated,
-   sensor dropout does not stop the pipeline,
-   WebSocket clients receive updates and can reconnect,
-   operator review is persisted in the audit log,
-   dashboard handles no data and stale data.

### Metrics

-   Detection: precision, recall, false alarms per hour.
-   Classification: macro-F1, confusion matrix, unknown-class
    performance.
-   Fusion: recall/false-alarm change against sensor baselines.
-   Tracking: IDF1/HOTA if the dataset and evaluator support them; also
    ID switches and fragmentation.
-   Group analytics: group-event precision/recall and false group
    alerts.
-   Reliability: performance under sensor dropout and degraded input.
-   Speed: end-to-end p50/p95/p99 latency and sustained throughput.
-   Calibration: whether confidence values correspond to observed
    correctness.

Never present illustrative latency numbers as achieved results. Record
actual measurements on the target hardware and test dataset.

## 21. Performance and real-time behavior

Measure end-to-end latency from observation timestamp/ingestion to
dashboard update, as well as each stage independently.

Potential measurements: - ingestion delay, - inference time, -
synchronization-buffer delay, - fusion/tracking time, - analytics
time, - API/WebSocket delivery delay, - browser render delay, - total
p50/p95/p99 latency, - frames per second and dropped-frame count.

Design for concurrent stages, bounded queues, backpressure, and
observable queue depth. If overloaded, use a documented frame-dropping
policy rather than allowing unbounded memory growth. Do not claim "real
time" until performance is measured on stated hardware and
representative inputs.

## 22. Security, privacy, and operational safeguards

-   Keep secrets in environment variables; provide `.env.example` with
    placeholders only.
-   Validate uploads by file type and size.
-   Restrict upload paths and avoid path traversal.
-   Add authentication before exposing the service beyond localhost.
-   Use role-based permissions for configuration and review actions.
-   Apply retention limits to snapshots and uploaded reference images.
-   Log operator actions and model/config versions.
-   Avoid collecting or retaining data beyond what the use case
    requires.
-   Display whether the app is in live, replay, or simulation mode.
-   Display sensor disagreement and uncertainty rather than hiding them.
-   No automatic action should be triggered by an unreviewed model
    output.

## 23. Repository structure

Use a monorepo with clear module boundaries. Suggested structure:

``` text
project-root/
├── SOLUTION.md
├── README.md
├── .env.example
├── docker-compose.yml                 # optional, only if needed
├── backend/
│   ├── pyproject.toml
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── routes_health.py
│   │   │   ├── routes_sensors.py
│   │   │   ├── routes_tracks.py
│   │   │   ├── routes_groups.py
│   │   │   ├── routes_events.py
│   │   │   ├── routes_search.py
│   │   │   └── websocket.py
│   │   ├── schemas/
│   │   ├── ingestion/
│   │   │   ├── base.py
│   │   │   ├── video_replay.py
│   │   │   ├── rf_replay.py
│   │   │   ├── radar_replay.py
│   │   │   └── thermal_replay.py
│   │   ├── vision/
│   │   ├── fusion/
│   │   ├── tracking/
│   │   ├── analytics/
│   │   ├── events/
│   │   ├── search/
│   │   ├── persistence/
│   │   ├── evaluation/
│   │   └── core/
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── charts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── styles/
│   └── tests/
├── data/
│   ├── sample/
│   └── README.md
├── docs/
│   ├── architecture.md
│   ├── data-contracts.md
│   └── evaluation.md
└── scripts/
    ├── run_dev.sh
    └── generate_demo_data.py
```│   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
│   │   │   │
## 24. UI design direction

Create a polished, professional research/operations dashboard: - dark
charcoal/navy base with high-contrast text, - restrained cyan/blue for
normal telemetry, - amber for degraded or uncertain states, - red
reserved for urgent attention, not generic decoration, - clear
typography and consistent spacing, - responsive sidebar and top status
bar, - compact metric cards, - readable charts with units and legends, -
consistent status chips, - accessible contrast and keyboard navigation.

Avoid excessive glow, gradients, or decorative animation that reduces
readability. Motion should communicate updates, not distract. Do not use
fake live values without a persistent `DEMO / SIMULATION` label.

## 25. Implementation roadmap for Claude Code

Implement in small, runnable phases. Do not generate the entire system
in one untested code dump.

### Phase 0 --- Repository inspection

-   Inspect existing files, package managers, code style, and
    environment.
-   Summarize what already exists and what must be added.
-   Preserve useful code; do not overwrite user work without checking.
-   Create a task checklist and record assumptions.

### Phase 1 --- Vertical-slice MVP

-   Create FastAPI backend and React/TypeScript frontend.
-   Add health endpoint and WebSocket event stream.
-   Add deterministic synthetic/replay observation generator.
-   Display sensor status, object detections, track cards, and event
    timeline.
-   Clearly mark all generated observations as simulation.
-   Add basic tests and setup instructions.

**Acceptance:** App starts locally with documented commands; simulated
events appear in the UI; disconnected state is handled.

### Phase 2 --- Vision replay and tracking

-   Add video file/webcam input behind an adapter.
-   Add replaceable detector interface.
-   Add snapshot capture and track history.
-   Add trajectory, confidence, and detection-count charts.
-   If model weights are absent, show a clear configuration message or
    use simulation mode.

**Acceptance:** Each detection has timestamp, source, class, confidence,
and track association where available.

### Phase 3 --- Sensor replay and synchronization

-   Add RF and radar JSON/CSV replay adapters.
-   Add timestamp normalization and configurable association window.
-   Add sensor health and ingestion-lag monitoring.
-   Display unmatched observations and sensor disagreement.

**Acceptance:** Missing, late, and out-of-order events are handled and
tested.

### Phase 4 --- Fusion and uncertainty

-   Implement late-fusion baseline with transparent association rules.
-   Keep sensor observations and fused track estimates separate.
-   Add provenance and uncertainty fields.
-   Add comparison of vision-only and fused output.

**Acceptance:** Fusion never requires every observation to match;
incompatible observations remain unassociated.

### Phase 5 --- Group analytics

-   Implement validated group metrics and clustering.
-   Add group size, dispersion, centroid trajectory when coordinate
    frames allow it, and membership timeline.
-   Add rules-based candidate-group alerts and review controls.

**Acceptance:** Analytics unit tests cover coordinate units, missing
tracks, and time gaps; group alerts do not claim intent.

### Phase 6 --- Object reference search

-   Add image/text/colour search over authorized snapshots.
-   Return candidate matches and supporting evidence.
-   Add operator confirmation and false-match feedback.
-   Keep similarity scores distinct from calibrated probabilities.

**Acceptance:** Search results can be reviewed and corrected; no
automatic engagement action exists.

### Phase 7 --- Evaluation and reports

-   Add reproducible offline evaluation runs.
-   Export metrics, charts, configuration, model versions, and
    limitations.
-   Add test-session-based splits and baseline comparison.

**Acceptance:** A report distinguishes real measurements from simulated
data and contains enough metadata to reproduce the run.

### Phase 8 --- Hardening

-   Add input validation, upload limits, authentication if exposed
    beyond localhost, retention controls, and audit logging.
-   Measure p50/p95/p99 latency and sustained throughput.
-   Test reconnects, sensor failures, and browser refresh.

**Acceptance:** Documented limitations, known failure modes, measured
performance, and a reproducible setup.

## 26. Claude Code working instructions

Follow these instructions throughout implementation:

1.  **Read before writing.** Inspect the repository and current files
    before editing.
2.  **Plan first.** Produce a concise implementation plan and identify
    dependencies.
3.  **Build a runnable vertical slice.** Prefer one working path
    end-to-end over many empty screens.
4.  **Use typed contracts.** Keep backend Pydantic schemas and frontend
    TypeScript types aligned.
5.  **No fake integrations.** If a physical sensor, API key, model
    weights, or dataset is unavailable, create a clearly labelled
    adapter/interface and document the requirement. Never pretend the
    integration is active.
6.  **No fabricated performance.** Demo data must be labelled; benchmark
    figures must be measured.
7.  **Add tests as each module is created.** Do not postpone all tests
    until the end.
8.  **Run checks.** Run backend tests, frontend type-check/build, and
    lint commands where configured. Report actual results and unresolved
    failures.
9.  **Handle errors explicitly.** Provide meaningful UI states for
    loading, empty, disconnected, degraded, and failed data.
10. **Keep scope disciplined.** Do not add weapon control, auto-aiming,
    interceptor guidance, or automatic target engagement.
11. **Explain commands.** Update README with exact setup/run/test
    commands for macOS and general Python/Node environments.
12. **End each phase with a summary.** List files changed, commands run,
    tests passed/failed, remaining tasks, and how to launch the app.

## 27. Definition of done

The first complete prototype is done when: - backend and frontend run
locally using documented commands; - simulation/replay mode is obvious
and reliable; - observations are timestamped and schema-validated; -
track history and required per-track graphs work; - group size and
dispersion analytics work for compatible data; - sensor status and
missing-sensor behavior are visible; - vision-only versus fusion
comparison can be evaluated on labelled data or clearly marked
simulation data; - object reference search returns reviewable
candidates; - operator review and event history are persisted; - tests
cover core math, synchronization, tracking lifecycle, and degraded
mode; - reports state data provenance, model/config versions, and
limitations; - no unsupported claims about accuracy, physical speed,
sensor availability, or hostile intent are presented; - no autonomous
weapon/target-engagement functionality is present.

## 28. First action

Claude Code should now: 1. Inspect the existing repository. 2. Summarize
its structure and identify what already works. 3. Propose the smallest
Phase 1 vertical slice. 4. Implement that slice, including tests and run
instructions. 5. Stop and report actual verification results before
proceeding to the next phase.
