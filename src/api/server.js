import { legalRequest } from '@/api'

export function getEnginesList() {
  return legalRequest('/api/server/getEnginesList').then(data => {
    return Promise.resolve(data.list)
  })
}

export function createGame(options) {
  return legalRequest('/api/server/createEngine', { options: options }).then(data => {
    return Promise.resolve(data.engine)
  })
}
