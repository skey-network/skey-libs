declare interface Device {
  address: string
  name?: string
  description?: string
  location?: {
    lat?: number
    lng?: number
    alt?: number
  }
  type?: string
  dapp?: string
  owner?: string
  active?: boolean
  connected?: boolean
}

declare interface Key {
  assetId: string
  name: string
  device: string
  owner: string
  issuer: string
  validTo: number
  issueTimestamp: number
  active: boolean
}

declare type Entry = BinaryEntry | BooleanEntry | DeleteEntry | IntegerEntry | StringEntry

declare interface BinaryEntry {
  key: string
  type?: 'binary'
  value: string
}

declare interface BooleanEntry {
  key: string
  type?: 'boolean'
  value: boolean
}

declare interface DataEntry {
  type?: 'integer' | 'boolean' | 'binary' | 'string'
  key: string
  /** integer/boolean/binary/string value */
  value: { [key: string]: any }
}

declare interface DeleteEntry {
  key: string
  /** null for entry deletion */
  value: { [key: string]: any }
}

declare interface IntegerEntry {
  key: string
  type?: 'integer'
  value: number
}

declare interface StringEntry {
  key: string
  type?: 'string'
  value: string
}
