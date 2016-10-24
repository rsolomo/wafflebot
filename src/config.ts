import assert = require('assert')

export class Config {
  readonly token: string
  constructor(obj: any) {
    assert.equal(typeof obj, 'object')
    assert.equal(typeof obj.token, 'string')

    this.token = obj.token
  }
}