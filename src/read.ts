import fetch from 'node-fetch'
import { deviceFields } from './constants'

type WithRequest = {
  request: (path: string) => Promise<any>
}

export type FetchDeviceDeps = WithRequest
export const fetchDevice = async (address: string, deps: FetchDeviceDeps) => {
  const query = deviceFields.map((field) => `key=${field}&`).join('')
  const path = `/addresses/data/${address}?${query}`
  const data = await deps.request(path)

  const obj: any = { address }

  for (const item of data) {
    if (item.key === 'lat' || item.key === 'lng' || item.key === 'alt') {
      obj[item.key] = Number(item.value)
    } else {
      obj[item.key] = item.value
    }
  }

  obj.location = { lat: obj.lat, lng: obj.lng, alt: obj.alt }

  delete obj.lat
  delete obj.lng
  delete obj.alt

  // TODO Remove later
  obj.active = true
  obj.connected = true

  return obj as Device
}

export type FetchKeyOwnerDeps = WithRequest
export const fetchKeyOwner = async (
  assetId: string,
  height: number,
  deps: FetchKeyOwnerDeps
) => {
  const path = `/assets/${assetId}/distribution/${height}/limit/${1}`
  const data = await deps.request(path)

  if (!data.values) return undefined

  const owner = Object.keys(data.values)[0]

  if (data.values[owner] !== 1) {
    return undefined
  }

  return owner
}

export type FetchHeightDeps = WithRequest
export const fetchHeight = async (deps: FetchHeightDeps): Promise<number> => {
  const path = '/blocks/height'
  const res = await deps.request(path)
  return res.height
}

export type RequestDeps = { baseUrl: string }
export const request = async (path: string, deps: RequestDeps) => {
  const url = `${deps.baseUrl}${path}`

  try {
    const res = await fetch(url)

    if (res.status !== 200) {
      throw new Error(
        `Error while fetching data from blockchain. Request to ${deps.baseUrl}${path} got ${res.status}`
      )
    }

    return await res.json()
  } catch {
    throw new Error(
      `Error while fetching data from blockchain. Request to ${deps.baseUrl}${path} cannot connect`
    )
  }
}

export type FetchDataWithRegexDeps = WithRequest
export const fetchDataWithRegex = async (
  regex: string,
  address: string,
  deps: FetchDataWithRegexDeps
) => {
  const path = `/addresses/data/${address}?matches=${encodeURI(regex)}`
  const res = await deps.request(path)
  return res as Entry[]
}

export type FetchDevicesDeps = {
  fetchDataWithRegex: (regex: string, address: string) => Promise<Entry[]>
}
export const fetchDevices = async (address: string, deps: FetchDevicesDeps) => {
  const entries = await deps.fetchDataWithRegex('device_.{35}', address)
  return entries.map((entry) => ({
    address: entry.key.replace('device_', ''),
    status: entry.value as string
  }))
}

export type FetchKeyWhitelistDeps = {
  fetchDataWithRegex: (regex: string, address: string) => Promise<Entry[]>
}
export const fetchKeyWhitellist = async (
  address: string,
  deps: FetchKeyWhitelistDeps
) => {
  const entries = await deps.fetchDataWithRegex('key_.{32,44}', address)
  return entries.map((entry) => ({
    assetId: entry.key.replace('key_', ''),
    status: entry.value as string
  }))
}
