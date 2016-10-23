import RouteRecognizer = require('route-recognizer')
import bunyan = require('bunyan')
import { Callback, Context } from 'aws-lambda'
import { HttpRequest, HttpResponse, Controller, Method, Scope } from './declaration'
import {testCtrl} from './controller/test'
import {undefinedCtrl} from './controller/undefined'

export const BASE_URL = 'https://api.groupme.com/v3'
const log = bunyan.createLogger({
  name: 'wafflebot'
})
const config = require('../settings')
const promise = Promise.resolve()

const recognizer = new RouteRecognizer<Map<Method, Controller>>()
recognizer.add([
  {
    path: '/rooms/test',
    handler: new Map<Method, Controller>([
      ['POST', testCtrl]
    ])
  }
])
recognizer.add([
  {
    path: '/rooms/undefined',
    handler: new Map<Method, Controller>([
      ['POST', undefinedCtrl]
    ])
  }
])

export function run(event: HttpRequest, context: Context, callback: Callback) {
  log.info({event})
  promise.then(() => {
    const routes = recognizer.recognize(event.path)
    if (!routes || !routes.length) {
      const notFound: HttpResponse = {statusCode: 404}
      return notFound
    }
    const fn = routes[0].handler.get(event.httpMethod)
    if (!fn) {
      const allowed = routes[0].handler.keys()
      const methodNotAllowed: HttpResponse = {
        statusCode: 405,
        headers: { allow: Array.from(allowed).join(', ')}
      }
      return methodNotAllowed
    }
    return fn({ req: event, context: context , config: config} as Scope)
  })
  .then((res) => {
    log.info({res})
    callback(undefined, res)
  })
  .catch((e) => {
    log.fatal(e)
    // handle REST / HTTP errors
    callback(undefined, {
      statusCode: e.statusCode || e.status || 500,
      body: e.body || ''
    })
  })
}
