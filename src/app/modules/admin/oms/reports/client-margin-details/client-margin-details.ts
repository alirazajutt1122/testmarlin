import { Component, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { DialogCmpReports } from '../dialog-cmp-reports';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { Exchange } from 'app/models/exchange';
import { Custodian } from 'app/models/custodian';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';
import * as pdf from '@grapecity/wijmo.pdf';
import * as gridPdf from '@grapecity/wijmo.grid.pdf';


declare var jQuery: any;

@Component({
  selector: '[client-margin-details]',
  templateUrl: './client-margin-details.html',
  encapsulation: ViewEncapsulation.None,
})

export class ClientMarginDetails {

    includeColumnHeader: boolean = true;
    scaleMode = gridPdf.ScaleMode.ActualSize;
    orientation = pdf.PdfPageOrientation.Landscape;
    exportMode = gridPdf.ExportMode.All;

  public myForm: FormGroup;
  isSubmitted: boolean = false;
  exchanges: any[];
  custodians: any[];
  exchange: string = '';
  exchangeId: number = -1;
  participantCode: string = '';
  participantId = 0;
  errorMessage: string = '';
  clientCode1: string = '';
  clientCode2: string = '';
  cash: number = 0;
  margin: number = 0;
  buyingPower: number = 0;
  openPosition: number = 0;
  remainingBuyingPower: number = 0;
  active: boolean = false;
  allowShortSell: boolean = false;
  riskAssessment: boolean = false;
  useOpenPosition: boolean = false;
  cmddata: any[] = [];
  holding: any[] = [];
  lang:any

  fromClientList: any[] = [];
  claims: any;

  @ViewChild('flexGrid',{ static: false }) flexGrid: wjcGrid.FlexGrid;
  @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
  @ViewChild('cmbCustodian',{ static: false }) cmbCustodian: wjcInput.ComboBox;
  @ViewChild('dialogCmp',{ static: false }) dialogCmp: DialogCmpReports;

  constructor(private appState: AppState, private listingService: ListingService,
    private _fb: FormBuilder, private orderService: OrderService, private authService: AuthService,private translate: TranslateService, public splash : FuseLoaderScreenService) {
    this.isSubmitted = false;
    this.claims = authService.claims;
    this.participantCode = AppConstants.participantCode;
            //_______________________________for ngx_translate_________________________________________

            this.lang=localStorage.getItem("lang");
            if(this.lang==null){ this.lang='en'}
            this.translate.use(this.lang)
            //______________________________for ngx_translate__________________________________________
  }

  ngOnInit() {
    this.addFromValidations();
    this.loadExchanges();
  }

  onExchangeChange(value): void {
    this.exchangeId = value;
    this.custodians = <any>[];
    if (value != -1) {
      this.loadCustodian(value);
      this.getClientsList(value);
    }
  }

  onCustodianChange(value): void {
    this.participantId = value;
  }

  loadExchanges() {

    this.splash.show();
    this.listingService.getExchangeList()
      .subscribe(restData => {
        if (AppUtility.isValidVariable(restData)) {
          this.exchanges = restData;
          let exchange: Exchange = new Exchange(-1, AppConstants.PLEASE_SELECT_STR);
          this.exchanges.unshift(exchange);
          this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
        }
      },
      error => {
        this.splash.hide();
        this.errorMessage = <any>error
      });
  }

  loadCustodian(exchangeId: number) {
    this.splash.show();
    this.listingService.getCustodianByExchange(exchangeId)
      .subscribe(resData => {
        this.splash.hide();
        if (AppUtility.isValidVariable(resData)) {
          this.custodians = resData;
          let cust: Custodian = new Custodian(0, AppConstants.PLEASE_SELECT_STR);
          this.custodians.unshift(cust);
          this.participantId = this.custodians[0].participantId;
        }
      },
      error => {
        this.splash.hide();
        this.errorMessage = <any>error
      });
  }

  onSubmit(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      if (this.participantCode != null && this.participantCode !== AppConstants.PLEASE_SELECT_STR)
        this.getClientMarginDetails(this.participantCode, this.cmbExchange.text, this.clientCode1, AppConstants.username);
      else
        this.getClientMarginDetails(AppConstants.loggedinBrokerCode, this.cmbExchange.text, this.clientCode1, AppConstants.username);
    }
  }

  getClientMarginDetails(lBC: string, eC: string, cC: string, user: string) {
    this.splash.show();
    this.clearFields();
    this.orderService.getClientMarginDetails(lBC, eC, cC, user).
      subscribe(resdata => {
        this.splash.hide();
        if (!AppUtility.isEmptyArray(resdata)) {
          let tempData: any = resdata;
          if (tempData.holding != null)
            this.formatHoldingData(tempData.holding);
          this.clientCode2 = tempData.code;
          this.cash = Number(tempData.cash);
          this.margin = Number(tempData.margin);
          this.buyingPower = Number(tempData.buying_power);
          this.openPosition = Number(tempData.open_position);
          this.remainingBuyingPower = Number(tempData.remaining_buying_power);

          this.active = tempData.active;
          this.allowShortSell = tempData.allow_short_sell;
          this.riskAssessment = !tempData.risk_assessment;  //  because backend sends the inverse value of this param @ 14/Apr/2017 - AiK
          this.useOpenPosition = tempData.use_open_position;
        }
        else {
          this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
          this.dialogCmp.showAlartDialog('Error');
        }
      },
      error => {
        
        this.splash.hide();
        if (error.status === 404){
          this.dialogCmp.statusMsg = 'Data not found.'; //  Defect id: 1177 @ 01/Aug/2017 - AiK
          if (this.lang=='pt'){
            this.dialogCmp.statusMsg = 'Dados não encontrados.'; //  Defect id: 1177 @ 01/Aug/2017 - AiK
           }
          }
        else if (error.status === 406){
          this.dialogCmp.statusMsg = 'Current user has no persmissions for the requested client.';
          if (this.lang=='pt'){
            this.dialogCmp.statusMsg = 'O usuário atual não tem permissões para o cliente solicitado.'; //  Defect id: 1177 @ 01/Aug/2017 - AiK
            }
          }
        else
          this.dialogCmp.statusMsg = error.statusText;
        this.dialogCmp.showAlartDialog('Error');
      }
      );
  }

  private clearFields() {
    this.clientCode2 = '';
    this.cash = 0;
    this.margin = 0;
    this.buyingPower = 0;
    this.openPosition = 0;
    this.remainingBuyingPower = 0;
    this.cmddata = [];
    this.active = false;
    this.allowShortSell = false;
    this.riskAssessment = false;
    this.useOpenPosition = false;
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchange: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
      custodian: [''],
      clientCode1: ['', Validators.compose([Validators.required])],
    });
  }

  private formatHoldingData(holdingData) {
    for (let i = 0; i < holdingData.length; i++) {
      holdingData[i].market_rate = Number(holdingData[i].market_rate);
      holdingData[i].market_value = Number(holdingData[i].market_value);
      holdingData[i].haircut = Number(holdingData[i].haircut);
      holdingData[i].assess_value = Number(holdingData[i].assess_value);
    }
    this.cmddata = holdingData;
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');
  }

  public getNotification(btnClicked) {

  }



   getClientsList(exchangeId) {
    this.splash.show();
    this.listingService.getClientListByExchangeBroker(exchangeId, AppConstants.participantId, true, true)
      .subscribe(restData => {
        this.splash.hide();
        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
          this.fromClientList = restData;
        }else{
          this.fromClientList = [];
        }
      },
      error => {this.splash.hide(); this.errorMessage = <any>error});
  }







  exportExcel() {
    wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'Client Margin Details.xlsx');
}




exportPDF() {
gridPdf.FlexGridPdfConverter.export(this.flexGrid, 'Client Margin Details' + new Date().toLocaleString() + '.pdf', {
   maxPages: 10,
   exportMode: this.exportMode,
   scaleMode: this.scaleMode,
   documentOptions: {
       pageSettings: {
           layout: this.orientation
       },
       header: {
           declarative: {
               text: '\t&[Page]\\&[Pages]'
           }
       },
       footer: {
           declarative: {
               text: '\t&[Page]\\&[Pages]'
           }
       }
   },
   styles: {
       cellStyle: {
           backgroundColor: '#ffffff',
           borderColor: '#c6c6c6'
       },
       altCellStyle: {
           backgroundColor: '#f9f9f9'
       },
       groupCellStyle: {
           backgroundColor: '#dddddd'
       },
       headerCellStyle: {
           backgroundColor: '#eaeaea'
       }
   }
});
}












}
