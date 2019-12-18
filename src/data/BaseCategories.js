import animals_pets from 'images/animals_pets.svg';
import city_school_buildings from 'images/city_school_buildings.svg';
import graffiti from 'images/graffiti.svg';
import health_neighborhoods from 'images/health_neighborhoods.svg';
import parks_playgrounds from 'images/parks_playgrounds.svg';
import sidewalks_streets from 'images/sidewalks_streets.svg';
import snow from 'images/snow.svg';
import parking from 'images/parking.svg';
import trash_recycling from 'images/trash_recycling.svg';
import trees from 'images/trees.svg';
import utilities from 'images/utilities.svg';
import street_lights_traffic_signals from 'images/street_lights_traffic_signals.svg';
import unknown from 'images/unknown.svg';

const BaseCategories = {
  '269': {
    ancestor_id: '0',
    name: 'Animals & Pets',
    dept: 'Animal Control',
    id: '269',
    icon: animals_pets
  },
  '272': {
    ancestor_id: '0',
    name: 'City & School Buildings',
    dept: 'DPW Buildings and Grounds',
    id: '272',
    icon: city_school_buildings
  },
  '273': {
    ancestor_id: '0',
    name: 'Graffiti',
    dept: 'DPW Highway',
    id: '273',
    icon: graffiti
  },
  '274': {
    ancestor_id: '0',
    name: 'Health & Neighborhood',
    dept: '0',
    id: '274',
    icon: health_neighborhoods
  },
  '275': {
    ancestor_id: '0',
    name: 'Parks & Playgrounds',
    dept: 'DPW Buildings and Grounds',
    id: '275',
    icon: parks_playgrounds
  },
  '276': {
    ancestor_id: '0',
    name: 'Sidewalks & Streets',
    dept: 'DPW Highway',
    id: '276',
    icon: sidewalks_streets
  },
  '277': {
    ancestor_id: '0',
    name: 'Snow',
    dept: '0',
    id: '277',
    icon: snow
  },
  '278': {
    ancestor_id: '0',
    name: 'Parking Department',
    dept: 'Parking',
    id: '278',
    icon: parking
  },
  '280': {
    ancestor_id: '0',
    name: 'Trash & Recycling',
    dept: '0',
    id: '280',
    icon: trash_recycling
  },
  '281': {
    ancestor_id: '0',
    name: 'Trees',
    dept: 'DPW Highway',
    id: '281',
    icon: trees
  },
  '282': {
    ancestor_id: '0',
    name: 'Utilities',
    dept: '0',
    id: '282',
    icon: utilities
  },
  '467': {
    ancestor_id: '0',
    name: 'Street Lights & Traffic Signals',
    dept: '0',
    id: '467',
    icon: street_lights_traffic_signals
  },
  '476263': {
    ancestor_id: '0',
    name: 'Unknown/Miscellaneous',
    dept: 'Constituent Services',
    id: '476263',
    icon: unknown
  }
};

export const DEFAULT_ANCESTOR_ID = '476263';

export default BaseCategories;
