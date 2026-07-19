import { LOCATIONS } from '../data/locations'

export const PROXIMITY_RADIUS = 14

export function distanceBetween(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function nearbyLocations(loc, radius = PROXIMITY_RADIUS) {
  return LOCATIONS
    .filter(l => l.id !== loc.id)
    .map(l => ({ ...l, distance: distanceBetween(loc, l) }))
    .filter(l => l.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
}

export function getSpreadPattern(loc, scoredLocations, radius = PROXIMITY_RADIUS) {
  const nearby = nearbyLocations(loc, radius)
  const nearbyIds = new Set(nearby.map(l => l.id))
  return scoredLocations
    .filter(l => nearbyIds.has(l.id) && l.level !== 'green')
    .map(l => ({ ...l, distance: nearby.find(n => n.id === l.id).distance }))
    .sort((a, b) => b.score - a.score)
}