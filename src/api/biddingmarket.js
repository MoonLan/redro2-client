import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/biddingmarket/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.biddingmarket)
  })
}

export function release(engineId, nodeName, biddingItem) {
  return legalRequest('/api/biddingmarket/release', {
    engineId: engineId,
    nodeName: nodeName,
    biddingItem: biddingItem
  }).then(data => {
    return Promise.resolve(data.biddingmarket)
  })
}

export function cancel(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarket/cancel', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarket)
  })
}

export function sign(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarket/sign', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarket)
  })
}

export function breakoff(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarket/breakoff', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarket)
  })
}

export function deliver(engineId, nodeName, biddingStageChange) {
  return legalRequest('/api/biddingmarket/deliver', {
    engineId: engineId,
    nodeName: nodeName,
    biddingStageChange: biddingStageChange
  }).then(data => {
    return Promise.resolve(data.biddingmarket)
  })
}
