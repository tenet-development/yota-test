import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Check {
  constructor(
    private readonly _msisdn: string,
    private readonly _status: boolean,
    private readonly _account: number,
  ) {}

  @ApiProperty()
  get msisdn(): string {
    return this._msisdn;
  }

  get status(): boolean {
    return this._status;
  }

  get account(): number {
    return this._account;
  }
}
