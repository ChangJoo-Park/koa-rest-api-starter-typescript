import koaRouter = require('koa-router')
import { Context } from 'koa'
const router: koaRouter = new koaRouter()

/**
 * @api {get} / Hello World
 */
router.get('/', async (ctx: Context, next: Function) => {
  console.log('hello')
  ctx.body = { text: 'Hello World' }
  ctx.state.push = {
    action: 'Hello',
    data: {
      name: 'ChangJoo Park'
    }
  }
  next()
})

export = router
