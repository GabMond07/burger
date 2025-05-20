import { Pipe, PipeTransform } from '@angular/core';
import { ProductExtra } from 'src/app/models/product-extra';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'extrasSelected',
  standalone: true
})
export class ExtrasSelectedPipe implements PipeTransform {

  constructor(
    private translateService:TranslateService
  ){}

  transform(value: ProductExtra[]): string[] {
    let optionsSelected: string[]= [];

    value.forEach(extra=>{
      extra.blocks.forEach(block=>{
        if(block.options.length== 1 && block.options[0].activate){
          optionsSelected.push(this.translateService.instant(block.name));
        }
        else{
          const optionSelected= block.options.find(option=> option.activate);
          if(optionSelected){
            optionsSelected.push(this.translateService.instant(block.name)+ ': '+
            this.translateService.instant(optionSelected.name));
          }
        }
      })
    })

    return optionsSelected;
  }

}
