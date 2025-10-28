import { Injectable } from '@angular/core';
import { InMemoryDbService, ResponseOptions } from 'angular-in-memory-web-api';

@Injectable()
export abstract class BaseMockController implements InMemoryDbService {
  protected constructor() {}

  abstract createDb(): Record<string, any>;

  protected createSuccessResponse(data: any, status = 200, message?: string): ResponseOptions {
    return { status, body: { status: "success", message, data } };
  }

  protected createErrorResponse(message: string, status = 400): ResponseOptions {
    return { status, body: { error: { message } } };
  }

  protected getJsonBody(req: any): any {
    return JSON.parse(req.body.toString());
  }

  protected getBodyReq(req: any): any {
    return req.body;
  }
}