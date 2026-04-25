/** A single point on the rail cross-section profile */
export interface ProfilePoint {
  x: number; // lateral position in mm (gauge side negative, field side positive)
  y: number; // vertical position in mm (0 = top of new rail, positive = downward/material removed)
}

/** A named target profile (e.g., AREMA 136RE) */
export interface TargetProfile {
  name: string;
  points: ProfilePoint[];
  tolerance: number; // acceptable deviation in mm
}

/** Result of comparing current profile to target */
export interface ProfileDeviation {
  /** Average absolute deviation across all points (mm) */
  averageDeviation: number;
  /** Maximum deviation at any single point (mm) */
  maxDeviation: number;
  /** Per-point deviations (positive = too high, negative = over-ground) */
  pointDeviations: number[];
  /** Percentage of points within tolerance */
  withinTolerance: number;
}
