import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { Params, ReportParams } from 'app/models/report-params';

import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

var downloadAPI = require('../../../../../../scripts/download-document');

declare var jQuery: any;


@Component({

    selector: 'client-gain-loss-rpt',
    templateUrl: './client-gain-loss-rpt.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClientGainLossRpt implements OnInit {
    //private showLoader: boolean = false;

    public myForm: FormGroup;
    public searchForm: FormGroup;
    //claims: any;
    reportParams: ReportParams;
    params: Params;
    dateFormat: string = AppConstants.DATE_FORMAT;
    dateMask: string = AppConstants.DATE_MASK;
    exchangeList: any[] = [];
    clientCustodianList: any[] = [];
    toClientList: any[] = [];
    fromClientList: any[] = [];
    securityList: any[] = [];
    entryTypeList: any[] = [];
    entryType: string = null;
    custodianExist: boolean = false;
    custodianId: Number = null;
    isItemsListStatusNew: boolean = false;
    itemsList: wjcCore.CollectionView;participantExchangeId: any;
;
    data: any;
    exchangeId: number = 0;
    errorMessage: string;
    public isSubmitted: boolean;
    public isValidStartDate: boolean;
    private _pageSize = 0;
    public recExist: boolean;

    lang: any
    pdfSrc: String
    pdf = false
    fileNameForDownload = "ClientGainLossReport.pdf"

    @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
    @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
    @ViewChild('GridTo') GridTo: wjcGrid.FlexGrid;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;

    constructor(private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private appState: AppState, private translate: TranslateService, private loader: FuseLoaderScreenService) {
        this.initForm();
        this.isSubmitted = false;
        this.isValidStartDate = true;
        //this.claims = authService.claims;
        this.loadexchangeList();

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
        this.participantExchangeId = AppConstants.claims2.participant.exchangeId
    }

    ngOnInit() {
        // Add Form Validations
        this.addFromValidations();
    }

    ngAfterViewInit() {
    }

    initForm() {
        this.reportParams = new ReportParams();
        this.params = new Params();
        this.params.START_DATE = new Date();
        this.params.END_DATE = new Date();
        this.toClientList = [];
        this.fromClientList = [];
        this.clearFields();
    }

    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        if (AppUtility.isValidVariable(this.searchForm)) {
            this.searchForm.markAsPristine();
        }
        this.toClientList = [];
        this.fromClientList = [];
        this.isSubmitted = false;
    }

    loadexchangeList(): void {
        console.log('getting exchangeList');
        this.listingService.getParticipantExchangeList(AppConstants.participantId).subscribe(
            data => {
                if (data != null) {
                    this.exchangeList = data;
                    let exchange: Exchange = new Exchange(AppConstants.PLEASE_SELECT_VAL, AppConstants.PLEASE_SELECT_STR, AppConstants.PLEASE_SELECT_STR);
                    this.exchangeList.unshift(exchange);
                    this.exchangeId = this.exchangeList[0].exchangeId;

                    data.map((a) => {
                        if (a.exchangeId == this.participantExchangeId) {
                          this.exchangeId = a.exchangeId;
                          this.params.EXCHANGE_ID = a.exchangeId;
                        }
                      })
                }
            },
            error => this.errorMessage = <any>error);
    }

    getExchangeBrokerFromClients(exchangeId) {
        this.fromClientList = [];
        if (AppUtility.isValidVariable(exchangeId)) {
            this.loader.show();
            this.listingService.getClientBasicInfoListByExchangeBroker(exchangeId, AppConstants.participantId, false, true)
                .subscribe(restData => {
                    this.loader.hide();
                    if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                        this.fromClientList = restData;
                    }
                },
                    error => { this.loader.hide(); this.errorMessage = <any>error });
        }
    }

    getExchangeBrokerToClients(exchangeId) {
        this.toClientList = [];
        if (AppUtility.isValidVariable(exchangeId)) {
            this.loader.show();
            this.listingService.getClientBasicInfoListByExchangeBroker(exchangeId, AppConstants.participantId, false, false)
                .subscribe(restData => {
                    this.loader.hide();
                    if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                        this.toClientList = restData;
                    }
                },
                    error => { this.loader.hide(); this.errorMessage = <any>error });
        }
    }

    public onExchangeChange(val) {
        this.getExchangeBrokerFromClients(val);
        this.getExchangeBrokerToClients(val);
    }

    public printReport(model: any, isValid: boolean) {
        AppUtility.printConsole('onSave Action, isValid: ' + isValid);
        this.isSubmitted = true;
        // check start and end date
        if (this.params.START_DATE.setHours(0, 0, 0, 0) > this.params.END_DATE.setHours(0, 0, 0, 0)) {
            this.isValidStartDate = false;
            isValid = false;
        } else {
            this.isValidStartDate = true;
        }
        if (isValid) {
            this.loader.show();
            this.params.PARTICIPANT_ID = AppConstants.participantId;
            let startDate = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
            let endDate = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
            let exchangeName: string = this.cmbExchange.getDisplayText(this.cmbExchange.selectedIndex);
            this.reportService.getClientsGainLoss(this.params.PARTICIPANT_ID, this.params.EXCHANGE_ID, exchangeName,
                encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()), encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), startDate, endDate, this.lang)
                .subscribe(
                    restData => {
                        this.loader.hide();
                        let reportData: any;
                        reportData = restData;
                        //let w = window.open(reportData.reportBase64);
                        // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
                        this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                        if (this.pdfSrc != "") {
                            this.pdf = true
                        }
                    },
                    error => {
                        this.loader.hide();
                        this.dialogCmp.statusMsg = error.message;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        }
    }

    public onSearch() {
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridFrom.refresh();
        this.GridTo.refresh();
    }

    public updateControlsFrom() {
        this.params.FROM_ACCOUNT = this.GridFrom.collectionView.currentItem.clientCode;
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridFrom.refresh();
    }

    public updateControlsTo() {
        this.params.TO_ACCOUNT = this.GridTo.collectionView.currentItem.clientCode;
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridTo.refresh();
    }

    public clearControls() {
        this.itemsList = new wjcCore.CollectionView();
        this.GridFrom.refresh();
        this.GridTo.refresh();
        this.recExist = false;
    }

    public populateItemGrid(searchClientCode: string, searchClientName: string) {
        this.recExist = false;
        if (this.params.EXCHANGE_ID <= 0) {
            this.dialogCmp.statusMsg = 'Please select Exchange first.';
            this.dialogCmp.showAlartDialog('Warning');
            return;
        }
        if (AppUtility.isEmpty(searchClientCode) && AppUtility.isEmpty(searchClientName)) {
            this.loader.show();
            this.listingService.getClientListByExchangeBroker(this.params.EXCHANGE_ID, AppConstants.participantId, false, true)
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        } else if (!AppUtility.isEmpty(searchClientCode) && AppUtility.isEmpty(searchClientName)) {
            this.listingService.getBindedClientListByBrokerAndExchangeAndClientCode(AppConstants.participantId, this.params.EXCHANGE_ID, encodeURIComponent(searchClientCode))
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        } else if (AppUtility.isEmpty(searchClientCode) && !AppUtility.isEmpty(searchClientName)) {
            this.listingService.getBindedClientListByBrokerAndExchangeAndClientName(AppConstants.participantId, this.params.EXCHANGE_ID, encodeURIComponent(searchClientName))
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        } else if (!AppUtility.isEmpty(searchClientCode) && !AppUtility.isEmpty(searchClientName)) {
            this.listingService.getBindedClientListByBrokerAndExchangeAndClientCodeAndClientName(AppConstants.participantId, this.params.EXCHANGE_ID, encodeURIComponent(searchClientCode), encodeURIComponent(searchClientName))
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        }
    }

    public getNotification(btnClicked) {
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            fromClientId: ['', Validators.compose([Validators.required])],
            toClientId: ['', Validators.compose([Validators.required,])],
            fromDate: ['', Validators.compose([Validators.required])],
            toDate: ['', Validators.compose([Validators.required])],
        });
    }
}