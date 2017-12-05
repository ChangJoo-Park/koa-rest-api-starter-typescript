import * as Koa from 'koa'
import * as Socket from 'socket.io'

const types = []

/**
 * Context must has `state.push`. 
 * Using action type of push and data.
 * push: {
 *  action: '',
 *  data: {}
 * }
 */
export const onRequestPush = (io: SocketIO.Server, ctx: Koa.Context, next: Function) => {
  next()
}