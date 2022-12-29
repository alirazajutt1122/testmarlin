import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import 'bootstrap-markdown/js/bootstrap-markdown.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'parsleyjs';
//import 'bootstrap-application-wizard/src/bootstrap-wizard.js';
//import 'twitter-bootstrap-wizard/jquery.bootstrap.wizard.js';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';
//import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
//import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import 'bootstrap-colorpicker';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import 'dropzone/dist/dropzone.js';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';
import { OnlineAccountRegistration } from './online-account-registration/online-account-registration';
import { TranslateModule } from '@ngx-translate/core';
import { DialogCmpRegistration } from './dialog-cmp-registration/dialog-cmp-registration';
import { OnlineAccountActivation } from './online-account-activation/online-account-activation';


export const routes = [
   { path: '', component: OnlineAccountRegistration },

];

@NgModule({
  imports: [
    WjCoreModule
    , AlertModule
    , WjInputModule
    , WjGridModule
    , WjGridFilterModule
    , WjGridDetailModule
    , CommonModule
    , TooltipModule
    , BsDropdownModule
    , RouterModule.forChild(routes)
    , FormsModule
    , ReactiveFormsModule
    , TranslateModule,
  ],

  declarations: [
    OnlineAccountRegistration,
    OnlineAccountActivation,
    DialogCmpRegistration
  ]

})
export class OnlineAccountRegModule {
  static routes = routes;
}
