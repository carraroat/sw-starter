import axios from "axios";
import http from "http";
import https from "https";

const SWAPI_URL = process.env.SWAPI_URL || "https://www.swapi.tech/api";

export const httpClient = axios.create({
  baseURL: SWAPI_URL,
  timeout: 8000,
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 50 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 }),
});
