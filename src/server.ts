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

// Socket.io
import * as Socket from 'socket.io'
import { onRequestPush } from './socket'
const io = Socket(server)

// Router && Controller
import { readdirToRouter } from './router'
const router = readdirToRouter()
app.use(router.routes())

// Handle Router's socket requests
/**
 * See intruction inside socket/index.ts
 */
app.use((ctx, next) => {
  if (ctx.state.push && ctx.state.push.action && ctx.state.push.data) {
    console.log('has push!!')
    onRequestPush(io, ctx, next)
  }
  next()
})
