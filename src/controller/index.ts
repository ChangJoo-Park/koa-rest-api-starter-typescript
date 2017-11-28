import koaRouter = require('koa-router')
import { Context } from 'koa'
const router = new koaRouter()

router.get('/', async (ctx: Context, next: Function) => {
  console.log('hello')
  ctx.body = 'Hello World'
})

export = router