const { verifyToken } = require('../services/tokens')
const { privilegedRoles } = require('../../config')

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return next()
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1]
  const tenant = req.headers.tenant = req.headers.tenant || '0'

  return verifyToken(token, tenant)
    .then(user => {
      // pass user details onto next route
      req.user = user
      req.user.isPrivileged = user.roles.some(role => privilegedRoles.includes(role))
      return next()
    })
    .catch(() => {
      return next()
    })
}
