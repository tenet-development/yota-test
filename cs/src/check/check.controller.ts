import { 
  Controller, 
  Post,
  Body, 
  Query, 
  HttpCode,
  HttpStatus, 
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { CheckService } from './check.service';
import { Check } from './check.class';
import { ApiImplicitQueries } from 'nestjs-swagger-api-implicit-queries-decorator';
import { 
  ApiBody, 
  ApiOkResponse, 
  ApiInternalServerErrorResponse, 
  ApiNotFoundResponse 
} from '@nestjs/swagger';

@Controller('check')
export class CheckController {
  constructor(private readonly service: CheckService) {}

  @Post()
  @HttpCode(200)
  @ApiBody({ type: [Check] })
  @ApiImplicitQueries([ 
    {
      name: 'customer_active', 
      description: 'allow payment for closed customers', 
      required: false
    }
  ])
  @ApiOkResponse({ description: 'Successfully.' })
  @ApiNotFoundResponse({ description: 'Not Found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error.' })
  async check(
    @Body() body: { msisdn: string }, 
    @Query() query: { customer_active?: string }
  ): Promise<{ account: number, status: boolean }> {
    const { customer_active } = query;
    const resolution = await this.service.check(body, customer_active);

    if (!resolution) throw new NotFoundException();

    return {
      account: resolution.account,
      status: resolution.status
    };
  }
}
