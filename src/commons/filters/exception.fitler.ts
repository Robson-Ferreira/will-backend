import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  flatten,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Error } from 'mongoose';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string[] = [exception.message || 'Internal Server Error'];

    switch (true) {
      case exception instanceof Error.ValidationError:
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        break;

      case exception instanceof BadRequestException:
        status = exception.getStatus();
        message = this.fortmatBadRequestErrorMessage(exception);
        break;

      case exception instanceof HttpException:
        status = exception.getStatus();
        message = exception.response;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private fortmatBadRequestErrorMessage(exception: any): string[] {
    const exceptionMessage = exception.getResponse().message;
    return Array.isArray(exceptionMessage)
      ? flatten(
          exceptionMessage.map((ex) => {
            return ex.toString().trim();
          }),
        )
      : exceptionMessage;
  }
}
