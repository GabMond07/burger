import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Product } from 'src/app/models/product';
import { ProductExtraOption } from 'src/app/models/product-extra-option';
import { GetProductById } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';
import { UserOrderService } from '../../services/user-order.service';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone:false
})
export class ProductPage {

  public product: Product;
  public total: number;

  constructor(
    private navController: NavController,
    private navParams: NavParams,
    private store: Store,
    private userOrderService:UserOrderService,
    private toastService:ToastService,
    private translate: TranslateService
  ) {
    this.product= null;
  }

  ionViewWillEnter(){
    console.log(this.navParams.data['product']);
    this.product= this.navParams.data['product'];

    if(this.product && this.product.extras){
      this.total= this.product.price;
    }

    if(!this.product){
      this.navController.navigateForward('categories');
    }
  }

  changeMultipleOption($event, options: ProductExtraOption[]){
    options.forEach(op => op.activate= $event.detail.value== op.name);
    this.calculateTotal();
  }

  calculateTotal(){
    this.total = this.userOrderService.priceProduct(this.product);
  }

  getProduct($event){
    this.store.dispatch(new GetProductById({id: this.product._id})).subscribe({
      next: ()=>{
        this.product= this.store.selectSnapshot(ProductsState.product);
        this.calculateTotal();
      },
      complete: ()=>{
        $event.target.complete();
      }
    });
  }

  addProductOrder(){
    this.userOrderService.addProduct(this.product);

    console.log(this.userOrderService.getProducts());

    this.toastService.showToast(
      this.translate.instant('label.product.add.success')
    );

    this.navController.navigateRoot('/');
  }

}
