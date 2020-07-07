export class PaymentError {
  constructor(
    private readonly _code: number,
    private readonly _message: string,
  ) {}

  get code(): number {
    return this._code;
  }

  get message(): string {
    return this._message;
  }
}
