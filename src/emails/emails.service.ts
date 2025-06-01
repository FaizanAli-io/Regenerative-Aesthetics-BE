import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
    );
  }

  async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    // const verificationUrl = `${process.env.APP_URL}/users/verify-email?token=${token}`;
    const verificationUrl = `http://localhost:3001/verify-email/${token}`;

    const mailOptions = {
      from: `"Regenerative Aesthetics" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h2>Please verify your email</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    try {
      const info =
        await this.transporter.sendMail(
          mailOptions,
        );
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error(
        'Error sending verification email:',
        error,
      );
      throw new Error(
        'Failed to send verification email',
      );
    }
  }

  async sendResetPasswordEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `http://localhost:3001/reset-password/${token}`;
    // const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Regenerative Aesthetics" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    try {
      const info =
        await this.transporter.sendMail(
          mailOptions,
        );
      console.log(
        'Reset password email sent:',
        info.response,
      );
    } catch (error) {
      console.error(
        'Error sending reset password email:',
        error,
      );
      throw new Error(
        'Failed to send reset password email',
      );
    }
  }

  // emails.service.ts
  async sendOrderStatusEmail(
    email: string,
    orderId: number,
    status:
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled',
  ): Promise<void> {
    let subject: string;
    let message: string;

    switch (status) {
      case 'processing':
        subject =
          'Your Order is Now Being Processed';
        message = `Your order #${orderId} is now being processed. We will notify you when it ships.`;
        break;
      case 'shipped':
        subject = 'Your Order Has Been Shipped';
        message = `Great news! Your order #${orderId} has been shipped. It's on the way.`;
        break;
      case 'delivered':
        subject = 'Your Order Has Been Delivered';
        message = `Your order #${orderId} has been delivered. We hope you enjoy your purchase!`;
        break;
      case 'cancelled':
        subject = 'Your Order Has Been Cancelled';
        message = `Your order #${orderId} has been cancelled. We hope you to see you again!`;
        break;
      default:
        return;
    }

    const mailOptions = {
      from: `"Regenerative Aesthetics" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html: `<h2>${subject}</h2><p>${message}</p>`,
    };

    try {
      const info =
        await this.transporter.sendMail(
          mailOptions,
        );
      console.log(
        `${status} email sent:`,
        info.response,
      );
    } catch (error) {
      console.error(
        `Error sending ${status} email:`,
        error,
      );
      throw new Error(
        `Failed to send ${status} email`,
      );
    }
  }
}
