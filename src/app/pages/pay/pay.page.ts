import { Component, OnInit } from '@angular/core';
import { UserOrderService } from '../../services/user-order.service';
import { NavController } from '@ionic/angular';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { environment } from 'src/environments/environment';
import { Select, Store } from '@ngxs/store';
import { CreatePaymentIntent } from 'src/app/models/create-payment-intent';
import { ClearPayment, CreatePaymentSheet } from 'src/app/state/stripe/stripe.actions';
import { StripeState } from 'src/app/state/stripe/stripe.state';
import { Observable, Subscription } from 'rxjs';
import { Payment } from 'src/app/models/payment';
import { CreateOrder } from 'src/app/state/orders/orders.actions';
import { OrdersState } from 'src/app/state/orders/orders.state';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
  standalone:false
})
export class PayPage {

  @Select(StripeState.payment)
  private payment$: Observable<Payment>;

  public ShowNewAccount: boolean;
  public step: number;
  public optionAddress: string;
  public showNewAddress: boolean;
  public address: string;
  private subscription: Subscription;

  constructor(
    public UserOrderService:UserOrderService,
    private navController:NavController,
    private store:Store,
    private toastService:ToastService,
    private translateService:TranslateService
  ) {}

  ionViewWillEnter(){
    this.ShowNewAccount= false;
    this.step= 1;
    this.subscription= new Subscription();
    this.optionAddress= 'address-default';
    this.showNewAddress= false;
    this.changeOptionAddress();
    Stripe.initialize({
      publishableKey: environment.publihKey
    });
    this.detectChangesPayment();
  }

  newAccount(){
    this.ShowNewAccount= true;
  }

  showLogin(){
    this.ShowNewAccount= false;
  }

  nextStep(){
    this.step++;
  }

  previousStep(){
    this.step--;
  }

  backHome(){
    this.navController.navigateForward('categories');
  }

  changeOptionAddress(){
    switch(this.optionAddress){

      case 'address-default':{
        this.showNewAddress= false;
        this.address= this.UserOrderService.getUser().address;
        break;
      }

      case 'choose-address':{
        this.showNewAddress= true;
        this.address= '';
        break;
      }
    }
  }

  payWithStripe(){
    const total= this.UserOrderService.totalOrder() *100;
    const paymentIntent: CreatePaymentIntent= {
      secretKey: environment.secretKey,
      amount: +total.toFixed(0),
      currency: 'EUR',
      customer_id: 'cus_SKDk8RZ5udCGoj'
    };

    this.store.dispatch(new CreatePaymentSheet({paymentIntent}));
  }

  createrOder(){
    const order= this.UserOrderService.getOrder();
    order.address= this.address;
    this.store.dispatch(new CreateOrder({order})).subscribe({
      next:()=> {
        const success= this.store.selectSnapshot(OrdersState.success);
        if(success){
          this.toastService.showToast(
            this.translateService.instant('label.pay.success', {'address': this.address}));
            this.UserOrderService.resetOrder();
            this.navController.navigateForward('categories');
        }
        else{
          this.toastService.showToast(
            this.translateService.instant('label.pay.fail'));
        }
      }, error:(err)=>{
        console.error(err);
        this.toastService.showToast(
            this.translateService.instant('label.pay.fail'));
      }
    });
  }

  detectChangesPayment(){
    const sub= this.payment$.subscribe({
      next:()=>{
        const payment= this.store.selectSnapshot(StripeState.payment);
        if(payment){
          Stripe.createPaymentSheet({...payment, merchantDisplayName: 'DDR'});
          Stripe.presentPaymentSheet().then((result)=>{
            console.log(result);
            if(result.paymentResult== PaymentSheetEventsEnum.Completed){
              this.createrOder();
            }
            else if(result.paymentResult== PaymentSheetEventsEnum.Failed){
              this.toastService.showToast(
            this.translateService.instant('label.pay.fail'));
            }
          })
        }
      }
    });
    this.subscription.add(sub);
  }

  ionViewWillLeave(){
    this.store.dispatch(new ClearPayment())
    this.subscription.unsubscribe();
  }

}
