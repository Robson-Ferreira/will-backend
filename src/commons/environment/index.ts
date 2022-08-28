import * as dotenv from 'dotenv';

dotenv.config();

export abstract class Env {
  public static readonly NODE_ENV: string = process.env.NODE_ENV;

  public static readonly APPLICATION_VERSION: string =
    process.env.APPLICATION_VERSION;

  public static readonly APP_PORT: string = process.env.APP_PORT;

  public static readonly DATABASE_URI: string = process.env.DATABASE_URI;

  public static readonly SWAGGER_TITLE: string = process.env.SWAGGER_TITLE;

  public static readonly SWAGGER_DESCRIPTION: string =
    process.env.SWAGGER_DESCRIPTION;

  public static readonly SWAGGER_DOCS: string = process.env.SWAGGER_DOCS;

  public static readonly SWAGGER_SERVER: string = process.env.SWAGGER_SERVER;

  public static readonly JWT_SECRET_HASH: string = process.env.JWT_SECRET_HASH;

  public static readonly PAYMENT_TICKET_PROVIDER_ENDPOINT: string =
    process.env.PAYMENT_TICKET_PROVIDER_ENDPOINT;

  public static readonly LIMIT_TO_TRY_PAY_AGAIN: number =
    +process.env.LIMIT_TO_TRY_PAY_AGAIN;

  public static readonly SENDGRID_API_KEY: string =
    process.env.SENDGRID_API_KEY;

  public static readonly SENDGRID_EMAIL_SENDER: string =
    process.env.SENDGRID_EMAIL_SENDER;
}
