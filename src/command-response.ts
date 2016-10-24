import {HttpResponse} from './declaration'

export class CommandResponse implements HttpResponse {
  public readonly statusCode = 200
  public readonly body: string
  constructor(text: string) {
    this.body = JSON.stringify({response_type: 'in_channel', text})
  }
}
