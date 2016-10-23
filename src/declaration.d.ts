import {Context} from 'aws-lambda'

// http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format
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

export interface Scope {
    req: HttpRequest
    context: Context
    config: any
}

export type Method = 'OPTION' | 'HEAD' | 'GET' | 'POST' | 'PUT' |'PATCH' | 'DELETE'
export type Controller = (scope: Scope) => Promise<HttpResponse>
