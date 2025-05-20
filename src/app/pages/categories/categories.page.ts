import { CategoriesState } from '../../state/categories/categories.state';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Select, Store } from '@ngxs/store';
import { GetCategories } from 'src/app/state/categories/categories.actions';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone:false
})
export class CategoriesPage {

  @Select(CategoriesState.categories)
  private categories$: Observable<Category[]>;

  public categories: Category[];

    private subscription: Subscription;

  constructor(
    private store:Store,
    private loadingController: LoadingController,
    private translate:TranslateService,
    private navController: NavController,
    private navParams: NavParams
  ) {
    this.categories= [];
  }

  ionViewWillEnter(){
    this.subscription= new Subscription();
    this.loadData();
  }

  async loadData(){

    const loading = await this.loadingController.create({
      message: this.translate.instant('label.loading')
    });

    await loading.present();

    this.store.dispatch(new GetCategories());

    this.categories$.subscribe({
      next:()=>{
        this.categories= this.store.selectSnapshot
        (CategoriesState.categories);
        console.log(this.categories);
        loading.dismiss();
      },error: (err)=>{
        console.log(err);
        loading.dismiss();
      }

    });
  }

  goToProducts(category:Category){
    this.navParams.data['idCategory']= category._id
    this.navController.navigateForward('list-products');
  }

  refreshsCategories($event){
    this.store.dispatch(new GetCategories());
    $event.target.complete();
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

}
