import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/market/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.market)
  })
}

export function buy(engineId, nodeName, marketJournalItem) {
  return legalRequest('/api/market/buy', {
    engineId: engineId,
    nodeName: nodeName,
    marketJournalItem: marketJournalItem
  }).then(data => {
    return Promise.resolve(data.market)
  })
}
