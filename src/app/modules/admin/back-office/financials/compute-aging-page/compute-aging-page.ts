import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Params, ReportParams } from 'app/models/report-params';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmp } from '../../user-site/dialog/dialog.component';

declare var jQuery: any;
@Component({
  selector: 'compute-aging-page',
  templateUrl: './compute-aging-page.html',
  encapsulation: ViewEncapsulation.None,
})
export class ComputeAgingPage implements OnInit {
  public myForm: FormGroup;
  public searchForm: FormGroup;

  //claims: any;

  reportParams: ReportParams;
  params: Params;

  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;

  exchangeList: any[] = [];
  clientCustodianList: any[] = [];
  clientList: any[] = [];
  securityList: any[] = [];
  entryTypeList: any[] = [];
  headLevelList: any[];
  headLevel: number = 0;
  entryType: string = null;

  custodianExist: boolean = false;
  custodianId: Number = null;

  isItemsListStatusNew: boolean = false;

  itemsList: wjcCore.CollectionView;lang: any;
;
  data: any;

  exchangeId: number = 0;
  errorMessage: string;

  public isSubmitted: boolean;

  private _pageSize = 0;

  @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
  @ViewChild('inputEntryType') inputEntryType: wjcInput.ComboBox;
  @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
  @ViewChild('inputClient') inputClient: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  constructor(private appState: AppState, private reportService: ReportService, public userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    //this.claims = authService.claims;
    this.params.HEAD_LEVEL = 1;
    this.loadheadLevel();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }
  ngOnInit() {
    // Add Form Validations
    this.addFromValidations();
  }
  ngAfterViewInit() {

  }

  /*********************************
 *      Public & Action Methods
 *********************************/
  initForm() {
    this.reportParams = new ReportParams();
    this.params = new Params();
    this.params.START_DATE = new Date();
    this.params.END_DATE = new Date();
    this.securityList = [];
    this.clientList = [];
    //this.entryTypeList = StockDepositWithdraw.getEntryTypesList();
    this.clearFields();
  }

  public clearFields() {
    // if (AppUtility.isValidVariable(this.myForm)) {
    //   this.myForm.markAsPristine();
    // }
    // if (AppUtility.isValidVariable(this.searchForm)) {
    //   this.searchForm.markAsPristine();
    // }

    this.securityList = [];
    this.clientList = [];
    this.clientCustodianList = [];
    this.headLevelList = [];
    this.custodianExist = false;
    this.isSubmitted = false;
  }

  loadheadLevel(): void {
    AppUtility.printConsole('in loadheadLevel');
    let headLevels: any[] = [];
    this.listingService.getLastHeadLevel(AppConstants.participantId).subscribe(
      data => {
        AppUtility.printConsole('complete headlevel: ' + JSON.stringify(data));
        this.headLevel = data.headLevel;
        if (this.headLevel !== 0) {
          this.headLevelList = this.params.getHeadLevelOptions(data.headLevel);
          // for (let i: number = 1; i <= this.headLevel; i++)
          //   headLevels[i] = { 'name': i.toString(), 'code': i };
        }
        // this.headLevelList = headLevels;
      },
      error => this.errorMessage = <any>error);
  }

  public onSaveAction(model: any, isValid: boolean) {
    AppUtility.printConsole("onSave Action, isValid: " + isValid);

    this.isSubmitted = true;

    if (isValid) {
      this.loader.show();
      let asOnDateString: string;
      asOnDateString = wjcCore.Globalize.format(this.params.DATE, AppConstants.DATE_FORMAT);
      this.reportParams.setParams(this.params);
      AppUtility.printConsole('params: ' + JSON.stringify(this.params));
      this.listingService.insertClientAging(AppConstants.participantId, asOnDateString)
        .subscribe(
          restData => {
            this.loader.hide();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          error => {
            
            this.loader.hide();
            this.dialogCmp.statusMsg = error.message;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
  }

  public getNotification(btnClicked) {
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      AsOnDate: ['', Validators.compose([Validators.required])],
    });
  }

}