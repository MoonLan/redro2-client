import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/marketreceiver/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.marketreceiver)
  })
}
