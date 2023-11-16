import ErrorResponse, { ErrorType } from "../ErrorResponse";
import { mapErrorResponse } from "../mapper";
import { isArray } from "underscore";

export type RequestOptions = {
    headers?: HeadersInit | undefined
    disableErrorNotification?: boolean
    detectContentType?: boolean
    notStringifyBody?: boolean
}

export default class ApiClient {
    protected BASE_URL: string;
    protected AUTHENTICATION_HEADER: boolean;
    protected _notificationContext: any = null//: NotificationContext | undefined;

    constructor() {
        this.BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000/`;
        this.AUTHENTICATION_HEADER = false;
    }

    public request = async (method: string, url: string, query: string, body: unknown | undefined, options: RequestOptions, _mapperFunction?: (element: unknown) => unknown) => {
        query = new URLSearchParams(query || {}).toString();
        if (query !== '') {
            query = '?' + query;
        }

        const headers: HeadersInit = new Headers({
            ...options.headers,
        })

        if (!options.detectContentType) {
            headers.set('Content-Type', 'application/json')
        }
        headers.append("Access-Control-Allow-Origin", "*")

        const parseBody = (body: unknown) => options.notStringifyBody ? body + "" : JSON.stringify(body)
        const bodyString = body ? parseBody(body) : null
        return fetch(this.BASE_URL + url + query, {
            method: method,
            headers: headers,
            body: bodyString
        }).then((response: Response) => {
            if (!response.ok) {
                throw response;
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                return response.text();
            }
        })
            .then((data) => {
                if (_mapperFunction !== undefined) {
                    if (isArray(data)) {
                        const mapped_data: unknown[] = [];
                        data.forEach((element: any) => {
                            mapped_data.push(_mapperFunction(element));
                        });
                        return mapped_data
                    } else {
                        return _mapperFunction(data);
                    }
                }
                return data;
            })
            .catch(async (error: Response | unknown) => {
                if (error instanceof Response) {
                    const contentType = error.headers.get("content-type");
                    if (error.status > 500) {
                        //if (this._notificationContext)
                        //    this._notificationContext.notify({ message: "We are currently performing maintenance. Please be patient for a moment and contact us if the issue persists.", severity: 'error' })
                        throw new ErrorResponse(error.status, "", ErrorType.UNKNOWN, new Date())
                    }
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const errJson = error.json()
                        throw mapErrorResponse(await errJson)
                    }
                } else {
                    throw error;
                }
            });
    }

    public get = async (url: string, query = '', options: RequestOptions = {}, _mapperFunction?: (element: unknown) => unknown) => {
        return this.request('GET', url, query, undefined, options, _mapperFunction);
    }

    public post = async (url: string, body: unknown, query = '', options: RequestOptions = {}, _mapperFunction?: (element: unknown) => unknown) => {
        return this.request('POST', url, query, body, options, _mapperFunction);
    }

    public put = async (url: string, body: unknown, query = '', options: RequestOptions = {}, _mapperFunction?: (element: unknown) => unknown) => {
        return this.request('PUT', url, query, body, options, _mapperFunction);
    }

    public patch = async (url: string, body: unknown, query = '', options: RequestOptions = {}, _mapperFunction?: (element: unknown) => unknown) => {
        return this.request('PATCH', url, query, body, options, _mapperFunction);
    }

    public delete = async (url: string, query = '', options: RequestOptions = {}) => {
        return this.request('DELETE', url, query, undefined, options, undefined);
    }
}