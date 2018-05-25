import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/biddingmarketreceiver/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data)
  })
}

export function releaseToUpstream(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/biddingmarketreceiver/releaseToUpstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingMarketItem: biddingMarketItem
  }).then(data => {
    return Promise.resolve(data)
  })
}

export function signToUpstream(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/biddingmarketreceiver/signToUpstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingMarketItem: biddingMarketItem
  }).then(data => {
    return Promise.resolve(data)
  })
}

export function cancelToUpstream(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/biddingmarketreceiver/cancelToUpstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingMarketItem: biddingMarketItem
  }).then(data => {
    return Promise.resolve(data)
  })
}
