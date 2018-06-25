import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/assemblydepartment/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.assemblydepartment)
  })
}

export function assemble(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/assemblydepartment/assemble', {
    engineId: engineId,
    nodeName: nodeName,
    ioJournalItem: ioJournalItem
  }).then(data => {
    return Promise.resolve(data.assemblydepartment)
  })
}
