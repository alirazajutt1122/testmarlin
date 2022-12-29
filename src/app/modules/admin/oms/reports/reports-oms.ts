import { Component, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';

import { AppState } from 'app/app.service';
import { AppUtility } from 'app/app.utility';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { Exchange } from 'app/models/exchange';
import { AppConstants } from 'app/app.utility';
import { Market } from 'app/models/market';
import { MarkSumm } from 'app/models/mark-summ';





@Component({
  selector: '[reports-oms]',
  templateUrl: './reports-oms.html',
  encapsulation: ViewEncapsulation.None,
})

export class ReportsOMS {


  constructor() {



  }

  ngOnInit() {

  }


}
