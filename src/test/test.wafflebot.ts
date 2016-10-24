import assert = require('assert')
import qs = require('querystring')
import {Config} from '../config'
import { HttpRequest } from '../declaration'
import { handle } from '../wafflebot'

function createStubHttpRequest(body: string): HttpRequest {
  return {
    httpMethod: 'POST',
    body: body,
    headers: null,
    path: '',
    pathParams: null,
    queryStringParameters: null
  }
}

describe('_run()', function () {
  it('should respond to pancakes', async function () {
    const config = new Config({outgoing_hook_token: '', command_token: ''})
    const req = createStubHttpRequest(qs.stringify({token: config.outgoing_hook_token, text: 'I like pancakes'}))
    const res = await handle(req, config)

    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body as string)
    assert.equal(typeof body.text, 'string')
  })
  it('should get stock prices', async function() {
    const config = new Config({outgoing_hook_token: '', command_token: ''})
    const req = createStubHttpRequest(qs.stringify({token: config.command_token, text: 'stock NASDAQ:MSFT'}))
    const res = await handle(req, config)

    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body as string)
    assert.equal(typeof body.text, 'string')
  })
  it('should echo', async function() {
    const config = new Config({outgoing_hook_token: '', command_token: ''})
    const req = createStubHttpRequest(qs.stringify({token: config.command_token, text: 'echo tacos and cheese'}))
    const res = await handle(req, config)

    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body as string)
    assert.equal(typeof body.text, 'string')
    assert.equal(body.text, 'tacos and cheese')
  })
  it('should trump randomly', async function() {
    const config = new Config({outgoing_hook_token: '', command_token: ''})
    const req = createStubHttpRequest(qs.stringify({token: config.command_token, text: 'trump'}))
    const res = await handle(req, config)

    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body as string)
    assert.equal(typeof body.text, 'string')
    assert.ok(!body.text.includes('Ray'))
  })
  it('should trump a target', async function() {
    const config = new Config({outgoing_hook_token: '', command_token: ''})
    const req = createStubHttpRequest(qs.stringify({token: config.command_token, text: 'trump Ray'}))
    const res = await handle(req, config)

    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body as string)
    assert.equal(typeof body.text, 'string')
    assert.ok(body.text.includes('Ray'))
  })
})
