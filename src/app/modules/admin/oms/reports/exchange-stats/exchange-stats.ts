import { Component, EventEmitter, Inject, ViewEncapsulation, ViewChild, Input, AfterViewInit, forwardRef, Type } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { IndexChartComponent } from '../../charts/index-chart/index-chart';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { AppState } from 'app/app.service';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { DialogCmpReports } from '../dialog-cmp-reports';
import { Exchange } from 'app/models/exchange';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';



@Component({
  selector: 'exchange-stats',
  templateUrl: './exchange-stats.html',
  encapsulation: ViewEncapsulation.None,
})

export class ExchangeStats {
  public myForm: FormGroup;
  isSubmitted: boolean = false;
  exchangeCode: string = AppConstants.PLEASE_SELECT_STR;
  exchanges: any[];
  exchangeId: number = -1;
  statsdata: any[] = [];
  errorMsg: string = '';
  claims: any;
  lang:any
  showChart: boolean = false;

  @ViewChild('flexGrid',{ static: true }) flexGrid: wjcGrid.FlexGrid;
  @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
  @ViewChild('chartExchangeStats',{ static: true }) chartExchangeStats: IndexChartComponent;
  @ViewChild(DialogCmpReports) dialogCmp: DialogCmpReports;

  constructor(private appState: AppState, private listingSvc: ListingService, private orderSvc: OrderService,
    private _fb: FormBuilder, private authService: AuthService,private translate: TranslateService, public splash : FuseLoaderScreenService) {
    this.isSubmitted = false;
    this.claims = authService.claims;
            //_______________________________for ngx_translate_________________________________________

            this.lang=localStorage.getItem("lang");
            if(this.lang==null){ this.lang='en'}
            this.translate.use(this.lang)
            //______________________________for ngx_translate__________________________________________
  }

  ngOnInit() {
    this.addFromValidations();
    this.populateExchangeList();
  }

  onExchangeChange(value: string) {
    this.exchangeCode = this.cmbExchange.getDisplayText(this.cmbExchange.selectedIndex);
  }

  onSubmit(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.exchangeCode = this.cmbExchange.getDisplayText(this.cmbExchange.selectedIndex);
      this.getData(this.exchangeCode);
    }
  }

  onRefresh() {
    AppUtility.printConsole('In onRefresh method');
    this.exchangeCode = this.cmbExchange.getDisplayText(this.cmbExchange.selectedIndex);
    this.getData(this.exchangeCode);
  }



  getData(exchcode: string): void {
    this.statsdata = <any>[];
    this.showChart = false;
    if (exchcode !== AppConstants.PLEASE_SELECT_STR && exchcode !== '') {
      this.splash.show();
      this.orderSvc.getExchangeStats(exchcode).subscribe(
        resData => {
            this.splash.hide();
          if (AppUtility.isEmptyArray(resData)) {
            this.statsdata = null;
            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
            this.dialogCmp.showAlartDialog('Error');
          } else {
            this.formatIndicesData(resData.indices);
          }
        },
        error => {
            this.splash.hide();
          this.errorMsg = <any>error.message;
          this.dialogCmp.statusMsg = this.errorMsg;
          this.dialogCmp.showAlartDialog('Error');
        });
    }
  }




  formatIndicesData(indicesData) {
    for (let i = 0; i < indicesData.length; i++) {
      indicesData[i].high = (indicesData[i].high);
      indicesData[i].low = (indicesData[i].low);
      indicesData[i].volume = Number(indicesData[i].volume);
      indicesData[i].value = (indicesData[i].value);
      indicesData[i].current = (indicesData[i].current);
      indicesData[i].change = (indicesData[i].change);
      indicesData[i].last = (indicesData[i].last);
    }
    this.statsdata = indicesData;
    this.ShowGraph(this.exchangeId, indicesData[0]);
  }

  OnIndexChange(selectedRow) {
    let selecteddata: any = this.flexGrid.selectedItems;
    if(AppUtility.isEmptyArray(selecteddata))
    {
        return;
    }
    else
    {
        this.ShowGraph(this.exchangeId, selecteddata[0]);
    }

  }

  ShowGraph(_exchangeId, _indexCode) {
    this.showChart = true;
    this.chartExchangeStats.exchangeId = _exchangeId;
    this.chartExchangeStats.indexCode = _indexCode.code;
    this.chartExchangeStats.refresh(1);
  }





  populateExchangeList() {
    this.splash.show();
    this.listingSvc.getExchangeList()
      .subscribe(
      restData => {
        this.splash.hide();
        if (AppUtility.isEmptyArray(restData)) {
          this.errorMsg = AppConstants.MSG_NO_DATA_FOUND;
        } else {
          this.exchanges = restData;

          let exch: Exchange = new Exchange();
          exch.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          exch.exchangeId = this.exchangeId;
          this.exchanges.unshift(exch);
          this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
          this.exchangeCode = (AppConstants.exchangeCode === '') ? this.exchanges[0].exchangeCode : AppConstants.exchangeCode;
          this.getData(this.exchangeCode);
        }
      },
      error => {
        this.splash.hide();
        this.errorMsg = <any>error;
      },
      () => { AppUtility.printConsole('populateExchangeList method finish'); });
  }




  addFromValidations() {
    this.myForm = this._fb.group({
      exchange: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])]
    });
  }





  public getNotification(btnClicked) {
  }
}
