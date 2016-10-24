import qs = require('querystring')
import fetch from 'node-fetch'
import {Response} from 'node-fetch'
import {createCommandResponse} from './command-response'

const HELP = `
/waffle stock <stock exchange>:<stock>
/waffle echo <words>
/waffle trump <user>?
/waffle js <code>
`

export function help(args: string[]) {
  return {
    statusCode: 200,
    body: JSON.stringify({response_type: 'ephemeral', text: HELP})
  }
}

export async function stock(args: string[]) {
  const res = await fetch(`http://www.google.com/finance/info?q=${args[1]}`)
  if (!res.ok) return createCommandResponse(res.statusText)
  // Google puts '//' in front of the JSON array
  const text = await res.text()
  const json = JSON.parse(text.replace('//', ''))
  if (!json.length) return createCommandResponse('no results found')
  return createCommandResponse(`${json[0].t} price was $${json[0].l} at ${json[0].lt}`)
}

export function echo(args: string[]) {
  return createCommandResponse(args.slice(1).join(' '))
}

/**
 * https://www.whatdoestrumpthink.com/api-docs/index.html
 */
export async function trump(args: string[]) {
  let res: Response
  if (args.length > 1) {
    const url = `https://api.whatdoestrumpthink.com/api/v1/quotes/personalized?${qs.stringify({q: args[1]})}`
    res = await fetch(url)
  } else {
    res = await fetch('https://api.whatdoestrumpthink.com/api/v1/quotes/random')
  }

  if (!res.ok) return createCommandResponse(res.statusText)
  const json = await res.json()
  return createCommandResponse(json.message)
}

export function js(code: string) {
  const value = new Function('return ' + code)()
  return createCommandResponse(value.toString())
}