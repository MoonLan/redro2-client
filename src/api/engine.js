import { legalRequest } from '@/api'

export function getTeams(engineId) {
  return legalRequest('/api/engine/getTeams', { engineId: engineId }).then(data => {
    return Promise.resolve(data.teams)
  })
}

export function getInfo(engineId) {
  return legalRequest('/api/engine/getInfo', { engineId: engineId }).then(data => {
    return Promise.resolve(data)
  })
}

export function nextStage(engineId) {
  return legalRequest('/api/engine/nextStage', { engineId: engineId }).then(data => {
    return Promise.resolve(data)
  })
}

export function nextDay(engineId) {
  return legalRequest('/api/engine/nextDay', { engineId: engineId }).then(data => {
    return Promise.resolve(data)
  })
}
