import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/biddingmarketreceiver/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function releaseToUpstream(engineId, nodeName, biddingItem) {
  return legalRequest('/api/biddingmarketreceiver/releaseToUpstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingItem: biddingItem
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function cancelToUpstream(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarketreceiver/cancelToUpstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function signToUpstream(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarketreceiver/signToUpstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function breakoffToUpstream(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarketreceiver/breakoffToUpstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function releaseToDownstream(engineId, nodeName, biddingItem) {
  return legalRequest('/api/biddingmarketreceiver/releaseToDownstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingItem: biddingItem
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function cancelToDownstream(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarketreceiver/cancelToDownstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function signToDownstream(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarketreceiver/signToDownstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}

export function breakoffToDownstream(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarketreceiver/breakoffToDownstream', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarketreceiver)
  })
}
