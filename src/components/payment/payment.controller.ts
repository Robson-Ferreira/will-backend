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
  PaymentTicketTransactionsResponsePaginatedDto,
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

    if (hasBeenPaid && hasBeenPaid.status === PaymentStatus.ERROR) {
      throw new ConflictException(
        `There was a failure to pay the ticket, please contact the call center.`,
      );
    }

    return this.paymentService.payTicket(payload, req.userId);
  }

  @Get('/ticket/transactions')
  @UseGuards(JWTGuard)
  @ApiOkResponse({ type: PaymentTicketTransactionsResponsePaginatedDto })
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
