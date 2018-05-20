import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/inventory/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.inventory)
  })
}

export function importInventory(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/inventory/importInventory', {
    engineId: engineId,
    nodeName: nodeName,
    ioJournalItem: ioJournalItem
  }).then(data => {
    return Promise.resolve(data.inventory)
  })
}

export function exportInventory(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/inventory/exportInventory', {
    engineId: engineId,
    nodeName: nodeName,
    ioJournalItem: ioJournalItem
  }).then(data => {
    return Promise.resolve(data.inventory)
  })
}

export function regist(engineId, nodeName, stocksItemList) {
  return legalRequest('/api/inventory/regist', {
    engineId: engineId,
    nodeName: nodeName,
    stocksItemList: stocksItemList
  }).then(data => {
    return Promise.resolve(data.inventory)
  })
}
