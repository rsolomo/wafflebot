import {HttpResponse} from './declaration'

export function createCommandResponse(text: string): HttpResponse {
  return {
    statusCode: 200,
    body: JSON.stringify({response_type: 'in_channel', text})
  }
} 