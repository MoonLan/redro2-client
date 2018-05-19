import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/account/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.account)
  })
}

export function add(engineId, nodeName, accountTransaction) {
  return legalRequest('/api/account/add', {
    engineId: engineId,
    nodeName: nodeName,
    accountTransaction: accountTransaction
  }).then(data => {
    return Promise.resolve(data.account)
  })
}
