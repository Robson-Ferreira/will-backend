import {
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LeanDocument } from 'mongoose';
import { JWTGuard } from '../../commons/guards';
import {
  GetTransactionHistoryDto,
  PayTicketDto,
  PayTicketResponseDto,
  TransactionHistoryResponsePaginatedDto,
} from './dto';
import { PaymentServiceInterface } from './interface';
import { PaymentEntity, PaymentStatus } from './schemas';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(
    @Inject('PaymentServiceInterface')
    private readonly paymentService: PaymentServiceInterface,
  ) {}

  @Post('/ticket')
  @UseGuards(JWTGuard)
  @ApiOkResponse({ type: PayTicketResponseDto })
  @ApiBearerAuth()
  async payTicket(
    @Body() payload: PayTicketDto,
    @Req() req: any,
  ): Promise<LeanDocument<PaymentEntity>> {
    const hasBeenPaid = await this.paymentService.hasBeenPaid(payload.billet);

    if (hasBeenPaid && hasBeenPaid.status === PaymentStatus.SUCCESS) {
      throw new ConflictException(
        `Ticket ${payload.billet} has already been paid.`,
      );
    }

    if (hasBeenPaid && hasBeenPaid.status === PaymentStatus.PENDING) {
      throw new ConflictException(
        `Ticket ${payload.billet} is still being processed.`,
      );
    }

    return this.paymentService.payTicket(payload, req.userId);
  }

  @Get('/transactions')
  @UseGuards(JWTGuard)
  @ApiOkResponse({ type: TransactionHistoryResponsePaginatedDto })
  @ApiBearerAuth()
  async transactionHistory(
    @Req() req: any,
    @Query() query?: GetTransactionHistoryDto,
  ): Promise<any> {
    const [count, pageSize, page, resultQuery] =
      await this.paymentService.getTransactionHistory(req.userId, query);

    return {
      count,
      pageSize,
      page,
      data: resultQuery,
    };
  }
}
