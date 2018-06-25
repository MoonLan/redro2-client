import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/inventoryregister/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.inventoryregister)
  })
}

export function regist(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/inventoryregister/regist', {
    engineId: engineId,
    nodeName: nodeName,
    ioJournalItem: ioJournalItem
  }).then(data => {
    return Promise.resolve(data.inventoryregister)
  })
}
