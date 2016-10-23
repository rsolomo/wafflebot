import fetch from 'node-fetch'
import {BASE_URL} from '../wafflebot'
import { HttpResponse, Scope } from '../declaration'

const quotes = [
  'I hate pancakes',
  'They serve pancakes in hell',
  'Pancakes are fucking gayyy...'
]

function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function undefinedCtrl(scope: Scope): Promise<HttpResponse> {
  const reqBody: {text: string, sender_type: string} = JSON.parse(scope.req.body)
  if (reqBody.sender_type === 'bot') return Promise.resolve({statusCode: 200})
  if (reqBody.text.includes('pancakes')) {
    return fetch(`${BASE_URL}/bots/post`, {
      method: 'POST',
      body: JSON.stringify({bot_id: scope.config.undefined_bot_id, text: random(quotes)})
    })
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText)
    })
    .then(() => Promise.resolve({statusCode: 200} as HttpResponse))
  }

  const matches = reqBody.text.match(/^waffle echo\s+(.+)/i)
  if (!matches) return Promise.resolve({statusCode: 200})
  return fetch(`${BASE_URL}/bots/post`, {
    method: 'POST',
    body: JSON.stringify({bot_id: scope.config.undefined_bot_id, text: `${matches[1]}`})
  })
  .then((res) => {
    if (!res.ok) throw new Error(res.statusText)
  })
  .then(() => Promise.resolve({statusCode: 200} as HttpResponse))
}