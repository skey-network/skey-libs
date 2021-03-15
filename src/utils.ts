import * as Crypto from '@waves/ts-lib-crypto'

export const extractValuesFromKey = (
  description: string
): { device?: string; validTo?: number } => {
  if (!description) return { device: undefined, validTo: undefined }

  const values = description.split('_')
  const validTo = Number(values[1])
  return { device: values[0], validTo: isNaN(validTo) ? undefined : validTo }
}

export type CreateAccountDeps = { chainId: string }
export const createAccount = (deps: CreateAccountDeps) => {
  const seed = Crypto.randomSeed(15)
  const privateKey = Crypto.privateKey(seed)
  const publicKey = Crypto.publicKey({ privateKey })
  const address = Crypto.address({ publicKey }, deps.chainId)

  return { seed, privateKey, publicKey, address }
}

export type WaitForNBlocksDeps = { fetchHeight: () => Promise<number> }
export const waitForNBlocks = (
  amount: number,
  interval = 500,
  deps: WaitForNBlocksDeps
) => {
  return new Promise<void>(async (resolve) => {
    let initialHeight = await deps.fetchHeight()

    const handle = setInterval(async () => {
      const currentHeight = await deps.fetchHeight()
      if (currentHeight - initialHeight !== amount) return

      clearInterval(handle)
      resolve()
    }, interval)
  })
}

export const delay = (timeout: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export type OnBlockchainUpdateDeps = {
  fetchHeight: () => Promise<number>
  delay: (timeout: number) => Promise<void>
}
export const onBlockchainUpdate = (
  callback: (height: number) => any,
  interval = 500,
  deps: OnBlockchainUpdateDeps
) => {
  let stop = false

  const promise = new Promise<void>(async (resolve) => {
    let lastHeight = await deps.fetchHeight()

    const handle = setInterval(async () => {
      if (stop) {
        clearInterval(handle)
        resolve()
        return
      }

      const currentHeight = await deps.fetchHeight()
      if (currentHeight === lastHeight) return

      const amount = currentHeight - lastHeight
      const heights = Array(amount)
        .fill(null)
        .map((_, index) => index + lastHeight + 1)

      lastHeight = currentHeight

      for (const height of heights) {
        await callback(height)
      }
    }, interval)
  })

  return Object.assign(promise, {
    cancel: async () => {
      stop = true
      await deps.delay(interval)
    }
  })
}
