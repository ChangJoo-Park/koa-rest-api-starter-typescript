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

// Router && Controller
import { readdirToRouter } from './router'
const router = readdirToRouter()
app.use(router.routes())
