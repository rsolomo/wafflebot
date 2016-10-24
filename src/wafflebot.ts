import bunyan = require('bunyan')
import qs = require('querystring')
import { Callback, Context } from 'aws-lambda'
import {Config} from './config'
import { HttpRequest, HttpResponse, Body } from './declaration'
import {CommandResponse} from './command-response'
import fetch from 'node-fetch'

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
const config = new Config(require('../settings'))
const HELP = `
/waffle stock <stock exchange>:<stock>
/waffle echo <words>
`

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
    case 'help': return help(parts)
    case 'stock': return stock(parts)
    case 'echo': return echo(parts)
    default: return {statusCode: 200}
  }
}

function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function help(args: string[]) {
  return new CommandResponse(HELP)
}

async function stock(args: string[]) {
  const res = await fetch(`http://www.google.com/finance/info?q=${args[1]}`)
  if (!res.ok) return new CommandResponse(res.statusText)
  const text = await res.text()
  const json = JSON.parse(text.replace('//', ''))
  if (!json.length) return new CommandResponse('no results found')
  return new CommandResponse(`${json[0].t} price was $${json[0].l} at ${json[0].lt}`)
}

function echo(args: string[]) {
  return new CommandResponse(args.slice(1).join(' '))
}
