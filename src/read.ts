import fetch from 'node-fetch'
import { deviceFields } from './constants'
import * as constants from '../src/constants'

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
    if (constants.floatDeviceFields.includes(item.key)) {
      obj[item.key] = Number(item.value)
    } else if (constants.booleanDeviceFields.includes(item.key)) {
      obj[item.key] = !!item.value
    } else {
      obj[item.key] = item.value
    }
  }

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

  if (!data.items) return undefined

  const owner = Object.keys(data.items)[0]

  if (data.items[owner] !== 1) {
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
  const entries = await deps.fetchDataWithRegex(constants.deviceRegex, address)
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
  const entries = await deps.fetchDataWithRegex(constants.keyRegex, address)
  return entries.map((entry) => ({
    assetId: entry.key.replace('key_', ''),
    status: entry.value as string
  }))
}

export type FetchKeyDeps = WithRequest
export const fetchKey = async (assetId: string, deps: FetchKeyDeps): Promise<any> => {
  const path = `/assets/details/${assetId}`
  return await deps.request(path)
}

export type FetchAliasesDeps = WithRequest
export const fetchAliases = async (
  address: string,
  deps: FetchAliasesDeps
): Promise<string[]> => {
  const path = `/alias/by-address/${address}`
  return await deps.request(path)
}

export interface DappScript {
  url: string
  raw?: string
  version: string
  required: boolean
}

export interface DappScripts {
  [scriptName: string]: DappScript
}

export const fetchScripts = async (): Promise<DappScripts> => {
  const url =
    'https://raw.githubusercontent.com/skey-network/skey-client-config/master/dapps.json'
  const res = await fetch(url)
  const body = await res.json()

  const scripts: DappScripts = await body.scripts

  await Promise.all(
    Object.entries(scripts).map(async ([key, val]) => {
      const scriptRes = await fetch(val.url)
      const scriptBody = await scriptRes.text()

      scripts[key].raw = scriptBody
    })
  )

  return scripts
}

export type findAddressByAliasDeps = WithRequest
export const findAddressByAlias = async (alias: string, deps: findAddressByAliasDeps) => {
  const path = `/alias/by-alias/${alias}`
  return await deps.request(path)
}
