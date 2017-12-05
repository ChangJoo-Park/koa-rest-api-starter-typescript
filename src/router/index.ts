import fs = require('fs')
import path = require('path')
import * as Router from 'koa-router'

export const readdirToRouter = (child = '') => {
  const router = new Router()
  let localPath = path.join(`${__dirname}/controller${child ? `/${child}` : ''}`, '..')
  fs.readdirSync(localPath).forEach((file: any) => {
    let path = file.split('.')
    let name = path[0]
    if (path.length > 1) {
      if (path[path.length - 1] === 'ts') {
        let child_path = child ? `${child}/` : ''
        let route = require(`../controller/${child_path}${name}`)
        if (name === 'index') {
          router.use(`/api/${child}`, route.routes(), route.allowedMethods())
        } else {
          router.use(`/api/${child_path}${name}`, route.routes(), route.allowedMethods())
        }
      }
    } else {
      readdirToRouter(file)
    }
  })
  return router
}
