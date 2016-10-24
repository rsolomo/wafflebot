import {Context} from 'aws-lambda'

export interface HttpRequest {
    httpMethod: Method
    path: string
    headers: { [key: string]: string } | null
    pathParams: { [key: string]: string } | null
    queryStringParameters: { [key: string]: string } | null
    body: string
}

export interface HttpResponse {
    statusCode: number
    headers?: { [key: string]: string }
    body?: string
}

export type Method = 'OPTION' | 'HEAD' | 'GET' | 'POST' | 'PUT' |'PATCH' | 'DELETE'

export interface Body {
  text: string
  token: string
}