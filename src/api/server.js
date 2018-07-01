import { legalRequest } from '@/api'

export function getInfo() {
  return legalRequest('/api/server/getInfo').then(data => {
    return Promise.resolve(data.server)
  })
}

export function getEnginesList() {
  return legalRequest('/api/server/getEnginesList').then(data => {
    return Promise.resolve(data.list)
  })
}

export function createGame(options) {
  return legalRequest('/api/server/createEngine', { options: options }).then(
    data => {
      return Promise.resolve(data.engine)
    }
  )
}

export function userLoginByMagicCode(magiccode) {
  return legalRequest('/api/server/userLoginByMagicCode', {
    magiccode: magiccode
  }).then(data => {
    return Promise.resolve(data.user)
  })
}

export function checkUser() {
  return legalRequest('/api/server/checkUser', {}).then(data => {
    return Promise.resolve(data.user)
  })
}

export function userLogout() {
  return legalRequest('/api/server/userLogout', {}).then(data => {
    return Promise.resolve()
  })
}

export function userRegist(name) {
  return legalRequest('/api/server/userRegist', {
    name: name
  }).then(data => {
    return Promise.resolve(data.user)
  })
}

export function addUserRole(userId, engineId, teamIndex, role) {
  return legalRequest('/api/server/addUserRole', {
    userId: userId,
    engineId: engineId,
    teamIndex: teamIndex,
    role: role
  }).then(data => {
    return Promise.resolve(data.user)
  })
}
