import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Imports for ngx translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DialogCmp } from './modules/admin/back-office/user-site/dialog/dialog.component';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';

//function for ngx translate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,'./assets/i18n/', '.json');
}


@NgModule({
  declarations: [

    DialogCmp
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    // * Translate IMPORTS
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    WjCoreModule,
    WjInputModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridDetailModule,


  ],
  providers: [
    SharedModule
  ],
  exports: [
    TranslateModule,
    DialogCmp
  ]
})
export class SharedModule {


}

