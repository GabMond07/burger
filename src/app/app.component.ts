
import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import config from 'capacitor.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  public load: boolean;

  constructor(
    private platform:Platform,
    private translate: TranslateService
  ) {
    this.initApp();
    this.load= false;
    this.translate.setDefaultLang('es');
  }

  initApp(){
    this.platform.ready().then( async()=>{
      const language = await Device.getLanguageCode();

      if(language.value){
        this.translate.use(language.value.slice(0, 2));
      }

      config.plugins.CapacitorHttp.enabled= true;

      this.load= true;
    } );
  }
}
