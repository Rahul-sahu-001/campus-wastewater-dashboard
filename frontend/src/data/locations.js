// Real building layout, taken directly from the campus map you uploaded.
// x / y are percentage positions used to place clickable hotspots over
// /public/campus-map.jpg — they are not GPS coordinates, they are read
// straight off your map image.

export const CATEGORY = {
  HOSTEL: 'Hostel',
  ACADEMIC: 'Academic Block',
  MESS: 'Mess',
  COMMUNITY: 'Community Building'
}

export const LOCATIONS = [
  // Hostels (green blocks on the map)
  { id: 'B8', name: 'B8', category: CATEGORY.HOSTEL, x: 58, y: 45 },
  { id: 'B9', name: 'B9', category: CATEGORY.HOSTEL, x: 62, y: 45 },
  { id: 'B10', name: 'B10', category: CATEGORY.HOSTEL, x: 69, y: 54 },
  { id: 'B11', name: 'B11', category: CATEGORY.HOSTEL, x: 59, y: 56 },
  { id: 'B12', name: 'B12', category: CATEGORY.HOSTEL, x: 64, y: 57 },
  { id: 'B13', name: 'B13', category: CATEGORY.HOSTEL, x: 30, y: 72 },
  { id: 'B14', name: 'B14', category: CATEGORY.HOSTEL, x: 35, y: 72 },
  { id: 'B15', name: 'B15', category: CATEGORY.HOSTEL, x: 49, y: 68 },
  { id: 'B16', name: 'B16', category: CATEGORY.HOSTEL, x: 44, y: 50 },
  { id: 'B17', name: 'B17', category: CATEGORY.HOSTEL, x: 78, y: 40 },
  { id: 'B18', name: 'B18', category: CATEGORY.HOSTEL, x: 54, y: 66 },
  { id: 'B19', name: 'B19', category: CATEGORY.HOSTEL, x: 47, y: 60 },
  { id: 'B20', name: 'B20', category: CATEGORY.HOSTEL, x: 37, y: 54 },
  { id: 'B21', name: 'B21', category: CATEGORY.HOSTEL, x: 32, y: 63 },
  { id: 'B22', name: 'B22', category: CATEGORY.HOSTEL, x: 29, y: 60 },
  { id: 'B23', name: 'B23', category: CATEGORY.HOSTEL, x: 41, y: 61 },
  { id: 'B24', name: 'B24', category: CATEGORY.HOSTEL, x: 84, y: 37 },
  { id: 'B25', name: 'B25', category: CATEGORY.HOSTEL, x: 80, y: 50 },
  { id: 'B26', name: 'B26', category: CATEGORY.HOSTEL, x: 87, y: 43 },

  // Academic blocks (yellow)
  { id: 'A9', name: 'A9', category: CATEGORY.ACADEMIC, x: 22, y: 88 },
  { id: 'A10', name: 'A10', category: CATEGORY.ACADEMIC, x: 31, y: 81 },
  { id: 'A11', name: 'A11', category: CATEGORY.ACADEMIC, x: 38, y: 85 },
  { id: 'A13', name: 'A13', category: CATEGORY.ACADEMIC, x: 55, y: 74 },
  { id: 'A14', name: 'A14', category: CATEGORY.ACADEMIC, x: 53, y: 80 },
  { id: 'A17', name: 'A17', category: CATEGORY.ACADEMIC, x: 79, y: 58 },
  { id: 'A18', name: 'A18', category: CATEGORY.ACADEMIC, x: 74, y: 66 },
  { id: 'LIBRARY', name: 'Library', category: CATEGORY.ACADEMIC, x: 64, y: 68 },

  // Mess halls (red circles on the map)
  { id: 'PEEPAL_MESS', name: 'Peepal Mess', category: CATEGORY.MESS, x: 91, y: 31 },
  { id: 'OAK_MESS', name: 'Oak Mess', category: CATEGORY.MESS, x: 71, y: 45 },
  { id: 'ALDER_MESS', name: 'Alder Mess', category: CATEGORY.MESS, x: 85, y: 57 },
  { id: 'PINE_MESS', name: 'Pine Mess', category: CATEGORY.MESS, x: 41, y: 69 },
  { id: 'TULASI_MESS', name: 'Tulasi Mess', category: CATEGORY.MESS, x: 44, y: 75 },

  // Community buildings (blue)
  { id: 'GUEST_HOUSE', name: 'Guest House', category: CATEGORY.COMMUNITY, x: 17, y: 60 },
  { id: 'VILLAGE_SQUARE', name: 'Village Square', category: CATEGORY.COMMUNITY, x: 15, y: 65 },
  { id: 'AUDITORIUM', name: 'Auditorium', category: CATEGORY.COMMUNITY, x: 9, y: 63 },
  { id: 'SPORTS_COMPLEX', name: 'Sports Complex', category: CATEGORY.COMMUNITY, x: 19, y: 71 },
  { id: 'HEALTH_CENTER', name: 'Health Center', category: CATEGORY.COMMUNITY, x: 14, y: 72 }
]

export const CATEGORY_COLOR = {
  [CATEGORY.HOSTEL]: '#2dd4a7',
  [CATEGORY.ACADEMIC]: '#f5d76e',
  [CATEGORY.MESS]: '#f2545b',
  [CATEGORY.COMMUNITY]: '#38bdf8'
}
