import * as sgEmail from '@sendgrid/mail';
import { Env } from '../../environment';

export const sendMail = async (to: string, content: any): Promise<void> => {
  const { subject, html } = content;

  sgEmail.setApiKey(Env.SENDGRID_API_KEY);

  const message = {
    to: to,
    from: Env.SENDGRID_EMAIL_SENDER,
    subject,
    html,
  };

  await sgEmail.send(message);
};
