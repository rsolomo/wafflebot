import assert = require('assert')

export interface Config {
  readonly outgoing_hook_token: string
  readonly command_token: string
}

export function createConfig(obj: any): Config {
  assert.equal(typeof obj, 'object')
  assert.equal(typeof obj.outgoing_hook_token, 'string')
  assert.equal(typeof obj.command_token, 'string')

  return {outgoing_hook_token: obj.outgoing_hook_token, command_token: obj.command_token}
}