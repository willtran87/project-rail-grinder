import { describe, it, expect } from 'vitest';
import { stepCrossingCar, STOP_LINE_LEFT, STOP_LINE_RIGHT, type CrossingCar } from './Landmarks';

/** The tracks: main at x = 0, adjacent at x = 5, cars ~4.2 m long, trains ~3 m wide */
const ON_TRACKS = (x: number) => x > -4.5 && x < 9.5;
const DT = 1 / 60;

function car(carX: number, carDir: -1 | 1, carSpeed = 9): CrossingCar {
  return { carX, carDir, carSpeed, carWait: 0, near: 110, far: 110 };
}

/** Run the car for `seconds` with the crossing open or closed */
function run(c: CrossingCar, seconds: number, closed: boolean, onFrame?: (c: CrossingCar) => void) {
  for (let t = 0; t < seconds; t += DT) {
    stepCrossingCar(c, DT, closed, () => 0.5);
    onFrame?.(c);
  }
}

describe('level-crossing car', () => {
  it('never drives onto the tracks while the crossing is closed (from any start, either side)', () => {
    for (let x = 14; x <= 100; x += 3) {
      const c = car(x, -1);
      run(c, 30, true, (s) => expect(ON_TRACKS(s.carX)).toBe(false));
    }
    for (let x = -10; x >= -100; x -= 3) {
      const c = car(x, 1);
      run(c, 30, true, (s) => expect(ON_TRACKS(s.carX)).toBe(false));
    }
  });

  it('stops exactly at the stop line and waits', () => {
    const fromRight = car(60, -1);
    run(fromRight, 20, true);
    expect(fromRight.carX).toBeCloseTo(STOP_LINE_RIGHT, 5);
    expect(fromRight.carSpeed).toBeLessThan(0.01);

    const fromLeft = car(-60, 1);
    run(fromLeft, 20, true);
    expect(fromLeft.carX).toBeCloseTo(STOP_LINE_LEFT, 5);
  });

  it('stops even when the lights start just before the line', () => {
    const c = car(STOP_LINE_RIGHT + 0.5, -1, 9);
    run(c, 5, true, (s) => expect(s.carX).toBeGreaterThanOrEqual(STOP_LINE_RIGHT));
  });

  it('a car already on the crossing keeps going and clears it', () => {
    const c = car(5, -1);
    run(c, 3, true);
    expect(c.carX).toBeLessThan(STOP_LINE_LEFT);
  });

  it('drives across when the crossing reopens', () => {
    const c = car(40, -1);
    run(c, 10, true);
    expect(c.carX).toBeCloseTo(STOP_LINE_RIGHT, 5);
    run(c, 5, false);
    expect(c.carX).toBeLessThan(STOP_LINE_LEFT);
  });

  it('pauses at the road end, then turns round', () => {
    const c = car(-100, -1);
    run(c, 2, false);
    expect(c.carX).toBeCloseTo(-c.near + 2.5, 5);
    expect(c.carWait).toBeGreaterThan(0);
    run(c, 10, false);
    expect(c.carDir).toBe(1);
    expect(c.carX).toBeGreaterThan(-c.near + 2.5);
  });
});
