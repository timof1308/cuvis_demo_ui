export enum ErrorType {
    ENTITY_NOT_FOUND, UNKNOWN, FORBIDDEN, MAIL_ERROR, INVALID_PARAMETER, CREDENTIALS_EXPIRED
}

export default class ErrorResponse {
    constructor(
        private _code: number,
        private _status: string,
        private _type: ErrorType,
        private _timeStamp: Date,
        private _message?: string,
        private _description?: string,
        //private _traceId?: string
    ) { }

    /*
    public get traceId(): string | undefined {
        return this._traceId;
    }
    public set traceId(value: string | undefined) {
        this._traceId = value;
    }
    */
    public get description(): string | undefined {
        return this._description;
    }
    public set description(value: string | undefined) {
        this._description = value;
    }
    public get message(): string | undefined {
        return this._message;
    }
    public set message(value: string | undefined) {
        this._message = value;
    }
    public get timeStamp(): Date {
        return this._timeStamp;
    }
    public set timeStamp(value: Date) {
        this._timeStamp = value;
    }
    public get status(): string {
        return this._status;
    }
    public set status(value: string) {
        this._status = value;
    }
    public get type(): ErrorType {
        return this._type;
    }
    public set type(value: ErrorType) {
        this._type = value;
    }
    public get code(): number {
        return this._code;
    }
    public set code(value: number) {
        this._code = value;
    }
}