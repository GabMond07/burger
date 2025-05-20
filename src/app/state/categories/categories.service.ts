import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  getCategories(){
    return CapacitorHttp.get({
      url: environment.urlApi+'categories',
      params: {},
      headers:{
        'Content-type': 'aplication/json'}
    }).then( (Response: HttpResponse) => {
      if(Response.status == 200){
        const data = Response.data as Category[];
        return data;
      }
      return [];
    }).catch( err=> {
      console.error(err);
      return [];
    })
  }

}
