/*
 * DeviceOrientation Event Specification: https://w3c.github.io/deviceorientation
 *
 * Copyright © 2022 World Wide Web Consortium, (Massachusetts Institute of
 * Technology, European Research Consortium for Informatics and Mathematics,
 * Keio University, Beihang). All Rights Reserved. This work is distributed
 * under the W3C® Software and Document License [1] in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * [1] http://www.w3.org/Consortium/Legal/copyright-software
 */

const degtorad = Math.PI / 180; // Degree-to-Radian conversion

/**
 * Computes the compass-heading from the device-orientation euler-angles.
 * Source: https://w3c.github.io/deviceorientation/#example-cad08fa0
 */
export function eulerAnglesToCompassHeading(alpha: number | null, beta: number | null, gamma: number | null): number {
  const _x = beta ? beta * degtorad : 0; // beta value
  const _y = gamma ? gamma * degtorad : 0; // gamma value
  const _z = alpha ? alpha * degtorad : 0; // alpha value

  const cY = Math.cos(_y);
  const cZ = Math.cos(_z);
  const sX = Math.sin(_x);
  const sY = Math.sin(_y);
  const sZ = Math.sin(_z);

  // Calculate Vx and Vy components
  const Vx = -cZ * sY - sZ * sX * cY;
  const Vy = -sZ * sY + cZ * sX * cY;

  // Calculate compass heading
  let compassHeading = Math.atan(Vx / Vy);

  // Convert compass heading to use whole unit circle
  if (Vy < 0) {
    compassHeading += Math.PI;
  } else if (Vx < 0) {
    compassHeading += 2 * Math.PI;
  }

  return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}
