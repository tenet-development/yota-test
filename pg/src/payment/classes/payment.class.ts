import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Payment {
  constructor(
    private readonly _msisdn: string,
    private readonly _date: string,
    private readonly _sum: number,
    private readonly _operation: string,
    private readonly _balance: number,
  ) {}

  @ApiProperty()
  get msisdn(): string {
    return this._msisdn;
  }
    
  @ApiPropertyOptional()
  get date(): string {
    return this._date
  }

  @ApiProperty()
  get sum(): number {
    return this._sum;
  };

  @ApiProperty()
  get operation(): string {
    return this._operation;
  }

  @ApiPropertyOptional()
  get balance(): number {
    return this._balance;
  }
}
