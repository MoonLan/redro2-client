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

export function userLogin(name, password) {
  return legalRequest('/api/server/userLogin', { name: name, password: password }).then(data => {
    return Promise.resolve(data.user)
  })
}
