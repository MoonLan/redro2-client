import { legalRequest } from '@/api'

export function getInfo(engineId) {
  return legalRequest('/api/scoreboard/getInfo', {
    engineId: engineId
  }).then(data => {
    return Promise.resolve(data.scoreboard)
  })
}
