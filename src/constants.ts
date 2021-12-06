export const stringDeviceFields = [
  'name', // string
  'type', // string
  'supplier', // string(address)
  'owner', // string(address)
  'version', // string
  'description', // string, optional
  'details', // string(json), optional
  'custom' // string(json), optional
]

export const floatDeviceFields = [
  'lat', // string(float), optional
  'lng', // string(float), optional
  'alt' // string(float), optional
]

export const booleanDeviceFields = [
  'active', // boolean
  'connected', // boolean
  'visible' // boolean
]

export const deviceFields = [
  ...stringDeviceFields,
  ...floatDeviceFields,
  ...booleanDeviceFields
]

export const deviceRegex = 'device_.{35}'
export const keyRegex = 'key_.{32,44}'
