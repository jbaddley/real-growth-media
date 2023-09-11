interface FetcherResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

export class Fetcher {
  static get<T>(input: RequestInfo, params?: RequestInit, qs?: any): Promise<FetcherResponse<T>> {
    if (qs) {
      const search = new URLSearchParams(qs);
      input = `${input}?${search.toString()}`;
    }
    return fetch(input, { method: "GET", ...params }).then((res) => res.json() as T);
  }
  static delete(input: RequestInfo, params?: RequestInit): Promise<FetcherResponse<any>> {
    return fetch(input, { method: "DELETE", ...params }).then((res) => res.json() as any);
  }
  static post<T, B>(input: RequestInfo, body?: B, params?: RequestInit): Promise<FetcherResponse<T>> {
    return fetch(input, { method: "POST", body: body ? JSON.stringify(body) : null, ...params }).then(
      (res) => res.json() as T
    );
  }
  static put<T, B>(input: RequestInfo, body?: B, params?: RequestInit): Promise<FetcherResponse<T>> {
    return fetch(input, { method: "PUT", body: body ? JSON.stringify(body) : null, ...params }).then(
      (res) => res.json() as T
    );
  }
}
