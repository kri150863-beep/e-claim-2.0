// mock-api.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};