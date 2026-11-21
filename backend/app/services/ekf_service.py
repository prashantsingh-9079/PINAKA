import numpy as np

class ExtendedKalmanFilter:
    """
    6-State Kinematic Extended Kalman Filter:
    State: [x, y, z, vx, vy, vz]^T
    Units: x,y in sector % (0-100), z in meters, velocities in delta/s.
    """
    def __init__(self, x=50.0, y=50.0, z=100.0, vx=0.0, vy=0.0, vz=0.0, q_factor=0.15, r_factor=0.8):
        self.state = np.array([x, y, z, vx, vy, vz], dtype=np.float64)
        
        # State covariance matrix P
        self.P = np.eye(6, dtype=np.float64) * 5.0
        
        # Process noise covariance Q
        self.Q = np.eye(6, dtype=np.float64) * q_factor
        self.Q[3:, 3:] *= 2.0  # Higher velocity uncertainty
        
        # Measurement noise covariance R
        self.R = np.eye(3, dtype=np.float64) * r_factor
        
        # Measurement matrix H (observing [x, y, z])
        self.H = np.zeros((3, 6), dtype=np.float64)
        self.H[0, 0] = 1.0
        self.H[1, 1] = 1.0
        self.H[2, 2] = 1.0

    def predict(self, dt: float):
        """Predicts state ahead by dt seconds."""
        # State transition matrix F
        F = np.eye(6, dtype=np.float64)
        F[0, 3] = dt
        F[1, 4] = dt
        F[2, 5] = dt
        
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + self.Q * dt
        return self.state

    def update(self, measured_xyz: np.ndarray) -> np.ndarray:
        """Updates state with new sensor measurement [x, y, z]."""
        z_meas = np.array(measured_xyz, dtype=np.float64)
        
        # Innovation / Measurement residual
        y = z_meas - (self.H @ self.state)
        
        # Innovation covariance
        S = self.H @ self.P @ self.H.T + self.R
        
        # Kalman Gain K
        K = self.P @ self.H.T @ np.linalg.inv(S)
        
        # State update
        self.state = self.state + K @ y
        
        # Covariance update
        I = np.eye(6, dtype=np.float64)
        self.P = (I - K @ self.H) @ self.P
        
        return self.state
