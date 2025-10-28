import { environment } from "../../../../../environments/environment";

export const MOCK_BACKEND_CONFIG = {
  defaultDelay: 300,
  enableLogging: !environment?.production,
  dataEncapsulation: false,
  delay: 200,
  apiBase: 'mock-api/',
  baseUrl: environment?.url,
  passThruUnknownUrl: true
};