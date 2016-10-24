import assert = require('assert')

export class Config {
  readonly outgoing_hook_token: string
  readonly command_token: string
  constructor(obj: any) {
    assert.equal(typeof obj, 'object')
    assert.equal(typeof obj.outgoing_hook_token, 'string')
    assert.equal(typeof obj.command_token, 'string')

    this.outgoing_hook_token = obj.outgoing_hook_token
    this.command_token = obj.command_token
  }
}