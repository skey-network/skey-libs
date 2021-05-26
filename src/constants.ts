export const deviceFields = [
  'name', // string
  'type', // string
  'supplier', // string(address)
  'owner', // string(address)
  'version', // string
  'lat', // string(float), optional
  'lng', // string(float), optional
  'alt', // string(float), optional
  'active', // boolean
  'connected', // boolean
  'visible', // boolean
  'description', // string, optional
  'details', // string(json), optional
  'custom' // string(json), optional
]

export const deviceRegex = 'device_.{35}'
export const keyRegex = 'key_.{32,44}'
