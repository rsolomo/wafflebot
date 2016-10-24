import bunyan = require('bunyan')
import qs = require('querystring')
import { Callback, Context } from 'aws-lambda'
import {createConfig, Config} from './config'
import { HttpRequest, HttpResponse, Body } from './declaration'
import * as subcommand from './subcommand'

process.on('uncaughtException', unhandled)
process.on('unhandledRejection', unhandled)

function unhandled(err: any) {
  bunyan.createLogger({name: 'wafflebot'}).fatal(err)
  process.exit(1)
}

const log = bunyan.createLogger({name: 'wafflebot'})
const quotes = [
  'I hate pancakes',
  'They serve pancakes in hell'
]
const pancakeRegex = /[Pp]ancake/
const config = createConfig(require('../settings'))

export async function run(event: HttpRequest, context: Context, callback: Callback) {
  try {
    const res = await handle(event, config)
    log.info({res})
    callback(undefined, res)
  } catch (err) {
    log.error({err})
    callback(undefined, {
      statusCode: err.statusCode || err.status || 500,
      body: err.body || ''
    })
  }
}

export async function handle(event: HttpRequest, config: Config): Promise<HttpResponse> {
  log.info({event})
  if (event.httpMethod !== 'POST') {
    return {statusCode: 405, headers: { allow: 'POST'}}
  }
  const body: Body = qs.parse(event.body)
  if (body.token !== config.outgoing_hook_token && body.token !== config.command_token) {
    return {statusCode: 403}
  }

  // Wafflebot's disdain for pancakes comes first
  if (pancakeRegex.test(body.text)) {
    return {statusCode: 200, body: JSON.stringify({text: random(quotes)})}
  }

  const parts = body.text.split(/\s+/)
  switch (parts[0]) {
    case 'help': return subcommand.help(parts)
    case 'stock': return subcommand.stock(parts)
    case 'echo': return subcommand.echo(parts)
    case 'trump': return subcommand.trump(parts)
    case 'Trump': return subcommand.trump(parts)
    case 'js': return subcommand.js(body.text.substr(body.text.indexOf(' ') + 1))
    default: return {statusCode: 200}
  }
}

function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
