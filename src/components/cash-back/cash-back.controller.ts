import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard, JWTGuard } from '../../commons/guards';
import { CashBackReponseDto, CreateCashBackDto } from './dto';
import { CashBackServiceInterface } from './interface';

@Controller('cash-back')
@ApiTags('Cash-Back')
export class CashBackController {
  constructor(
    @Inject('CashBackServiceInterface')
    private readonly cashBackService: CashBackServiceInterface,
  ) {}

  @UseGuards(JWTGuard, IsAdminGuard)
  @ApiOkResponse({ type: CashBackReponseDto })
  @ApiBearerAuth()
  @Post('/rules')
  async createCashBack(
    @Body() payload: CreateCashBackDto,
  ): Promise<CashBackReponseDto> {
    return this.cashBackService.createCashBackRule(payload) as any;
  }
}
