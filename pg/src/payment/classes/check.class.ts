import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Check {
  constructor(
    private readonly _msisdn: string,
    private readonly _status: boolean,
    private readonly _account: number,
    private readonly _message: string,
  ) {}

  @ApiProperty()
  get msisdn(): string {
    return this._msisdn;
  }

  @ApiPropertyOptional()
  get status(): boolean {
    return this._status;
  }

  @ApiPropertyOptional()
  get account(): number {
    return this._account;
  }

  @ApiPropertyOptional()
  get message(): string {
    return this._message;
  }
}
