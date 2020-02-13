/*
  This file is used to set preferred display names for categories
  from raw data sources. Each line is in the following format:

  "RAW CATEGORY NAME": "Preferred display name",

  The first string, to the left of the colon, is the "raw" category
  name. The second string, to the right of the colon, is the desired
  display name for that category.

  To modify any existing display name mappings, simply edit the display
  name for the category you want to change (or delete the line
  entirely if you'd rather go back to the old name).

  To add a new display name, add a new line to the object below in the
  format described above. The new line can go anywhere inside the object,
  as long as it's inside the {}. The raw category name must match the
  category name from the data source exactly (case sensitive), but the
  display name can be in any format you want. Both strings should be in
  quotation marks. Make sure every line has a comma at the end.
*/

const CategoryNames = {
  // Quality of Life
  ANIMALS: 'Animals',
  DRUGS: 'Drugs',
  DRUNK: 'Drunk',
  GROUPS: 'Groups',
  'HYPO-FND': 'Hypo found',
  'MV VANDL': 'Motor vehicle vandalism',
  NOISE: 'Noise',
  'NOISE/FW': 'Noise/FW',
  'ROAD RAGE': 'Road rage',
  UNWANTED: 'Unwanted',

  // Criminal Incidents
  'BURGLARY/BREAKING AND ENTERING': 'Burglary/breaking and entering',
  'MOTOR VEHICLE THEFT': 'Motor vehicle theft',
  ROBBERY: 'Robbery',
  'THEFT FROM MOTOR VEHICLE': 'Theft from motor vehicle',

  // Motor Vehicle Citations
  'INSPECTION/STICKER, NO c90 S20': 'No inspection/sticker',
  'LICENSE NOT IN POSSESSION c90 S11': 'License not in possession',
  'LICENSE SUSPENDED, OP MV WITH c90 S23':
    'Operating motor vehicle with license suspended',
  'MARKED LANES VIOLATION c89 S4A': 'Marked lanes violation',
  'OP MV WITH c90 S23': 'Operating motor vehicle with c90 S23',
  'PASSING VIOLATION c89 S2': 'Passing violation',
  'SAFETY STANDARDS, MV NOT MEETING RMV c90 S7A':
    'Motor vehicle not meeting RMV safety standards',
  'STOP/YIELD, FAIL TO c89 S9': 'Failure to stop/yield',
  'UNSAFE OPERATION OF MV c90 S13': 'Unsafe operation of motor vehicle',

  // Traffic enforcement
  'MV STOP': 'Motor vehicle stop',
  TRAFCOMP: 'Traffic comp',
  TRESPTOW: 'Trespassing/towing',
  PARKVIOL: 'Parking violation',
  BOOTLIST: 'Boot list'
};

export default CategoryNames;
