import { LOCATIONS } from '../data/locations'

// Max "distance" (in the same % units used for x/y on the map) within which
// two locations are considered close enough to plausibly share a drainage
// line, sewage path, or foot-traffic pattern.
export const PROXIMITY_RADIUS = 14

export function distanceBetween(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Every OTHER location within `radius` of `loc`, sorted nearest-first,
 * each annotated with its distance.
 */
export function nearbyLocations(loc, radius = PROXIMITY_RADIUS) {
  return LOCATIONS
    .filter(l => l.id !== loc.id)
    .map(l => ({ ...l, distance: distanceBetween(loc, l) }))
    .filter(l => l.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Given a location and the full list of scored locations, find nearby
 * buildings that are ALSO showing elevated risk (yellow/red) — a simple
 * proxy for "this may be part of the same spread pattern", since campus
 * wastewater lines and foot traffic tend to be geographically clustered.
 */
export function getSpreadPattern(loc, scoredLocations, radius = PROXIMITY_RADIUS) {
  const nearby = nearbyLocations(loc, radius)
  const nearbyIds = new Set(nearby.map(l => l.id))
  return scoredLocations
    .filter(l => nearbyIds.has(l.id) && l.level !== 'green')
    .map(l => ({ ...l, distance: nearby.find(n => n.id === l.id).distance }))
    .sort((a, b) => b.score - a.score)
}