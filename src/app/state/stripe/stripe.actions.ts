import { CreatePaymentIntent } from "src/app/models/create-payment-intent";

export class CreatePaymentSheet {
  static readonly type = '[Stripe] Create payment sheet';
  constructor(public payload: {paymentIntent: CreatePaymentIntent}) { }
}

export class ClearPayment{
  static readonly type = '[Stripe] Clear payment';
}
