import { legalRequest } from '@/api'

export function getInfo(engineId, nodeName) {
  return legalRequest('/api/io/getInfo', {
    engineId: engineId,
    nodeName: nodeName
  }).then(data => {
    return Promise.resolve(data.io)
  })
}

export function importIO(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/io/importIO', {
    engineId: engineId,
    nodeName: nodeName,
    ioJournalItem: ioJournalItem
  }).then(data => {
    return Promise.resolve(data.io)
  })
}

export function exportIO(engineId, nodeName, ioJournalItem) {
  return legalRequest('/api/io/exportIO', {
    engineId: engineId,
    nodeName: nodeName,
    ioJournalItem: ioJournalItem
  }).then(data => {
    return Promise.resolve(data.io)
  })
}
