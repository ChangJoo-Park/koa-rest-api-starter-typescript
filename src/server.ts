import * as Koa from 'koa'
const app = new Koa() 

// Error Logger
import { resBody, resError, resInfo } from './utils/response'
app.on('error', (err: Error, ctx: Koa.Context) => {
  resError(ctx.request.url, err)
  console.log(err)
})

// Middlewares
import bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const cors = require('koa-cors')
const logger = require('koa-logger')
const convert = require('koa-convert')

app.use(convert(bodyParser()))
app.use(convert(json()))
app.use(convert(cors()))
app.use(convert(logger()))

// DB
import mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/app-data')

// Router && Controller
import fs = require('fs')
import * as Router from 'koa-router'
const router = new Router()

function readdirToRouter(child = '') {
  let path = `${__dirname}/controller${child ? `/${child}` : ''}`
  fs.readdirSync(path).forEach((file) => {
    let path = file.split('.')
    let name = path[0]
    if (path.length > 1) {
      if (path[path.length - 1] === 'ts') {
        let child_path = child ? `${child}/` : ''
        let route = require(`./controller/${child_path}${name}`)
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
}

readdirToRouter()
app.use(router.routes())

// server
import http = require('http')
const port = process.env.PORT || '3000'
const server = http.createServer(app.callback())
server.listen(port)
server.on('listen', () => {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
})
