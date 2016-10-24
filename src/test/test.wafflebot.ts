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
    const config = new Config({token: 'asdf'})
    const req = createStubHttpRequest(qs.stringify({token: config.token, text: 'I like pancakes'}))
    const res = await handle(req, config)

    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body as string)
    assert.equal(typeof body.text, 'string')
  })
})