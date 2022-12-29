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
import { ParticipantBranch } from 'app/models/participant-branches';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

var downloadAPI = require('../../../../../../scripts/download-document');

declare var jQuery: any;


@Component({
    selector: 'client-pre-settlement-delivery-rpt',
    templateUrl:'./client-pre-settlement-delivery-rpt.html',
    encapsulation: ViewEncapsulation.None,
})

export class ClientPreSettlementDeliveryRpt implements OnInit {
    //private showLoader: boolean = false;

    public myForm: FormGroup;
    public searchForm: FormGroup;
    settlementCalendarList: wjcCore.CollectionView;
    public recExist: boolean;

    reportParams: ReportParams;
    params: Params;

    dateFormat: string = AppConstants.DATE_FORMAT;
    dateMask: string = AppConstants.DATE_MASK;

    exchangeList: any[] = [];
    participantBranchList: any[] = [];
    clientCustodianList: any[] = [];
    clientList: any[] = [];
    securityList: any[] = [];
    reportTypeList: any[] = [];
    reportType: string = null;
    reportFormatList: any[] = [];
    reportFormat: string = 'PDF';

    custodianExist: boolean = false;
    custodianId: Number = null;

    isItemsListStatusNew: boolean = false;

    itemsList: wjcCore.CollectionView;
    data: any;

    exchangeId: number = 0;
    errorMessage: string;

    startDate: string = '';
    endDate: string = '';
    settlementDate: string = '';
    selectedexchangeCode: string = '';
    settlementCalendarId: number = 0;
    Ex_ID: number = 0;
    public isSubmitted: boolean;
    lang: any
    pdfSrc: String
    pdf = false
    fileNameForDownload = "ClientPreSettlementDeliveryReport.pdf"
    private _pageSize = 0;

    @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
    @ViewChild('settlementGrid') settlementGrid: wjcGrid.FlexGrid;
    @ViewChild('inputEntryType') inputEntryType: wjcInput.ComboBox;
    @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
    @ViewChild('inputClient') inputClient: wjcInput.ComboBox;
    @ViewChild('tradeDate') tradeDate: wjcInput.InputDate;
    @ViewChild('inputReportType') inputReportType: wjcInput.ComboBox;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;

    constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
        this.initForm();
        this.isSubmitted = false;

        AppUtility.printConsole('PM: ' + this.userService.isAuhtorized(this.userService.EB_PART_MONEY_OBL_REPORT_VIEW));
        AppUtility.printConsole('CM: ' + this.userService.isAuhtorized(this.userService.EB_CL_MONEY_OBL_REPORT_VIEW));
        AppUtility.printConsole('PD: ' + this.userService.isAuhtorized(this.userService.EB_PART_DEL_OBL_REPORT_VIEW));
        AppUtility.printConsole('CD: ' + this.userService.isAuhtorized(this.userService.EB_CL_DEL_OBL_REPORT_VIEW));

        if (this.userService.isAuhtorized(this.userService.EB_PART_DEL_OBL_REPORT_VIEW))
            this.reportTypeList.unshift({ 'name': 'Participant Delivery Obligations', 'code': 'pdo' });
        if (this.userService.isAuhtorized(this.userService.EB_CL_DEL_OBL_REPORT_VIEW))
            this.reportTypeList.unshift({ 'name': 'Client Delivery Obligations', 'code': 'cdo' });
        if (this.userService.isAuhtorized(this.userService.EB_PART_MONEY_OBL_REPORT_VIEW))
            this.reportTypeList.unshift({ 'name': 'Participant Money Obligations', 'code': 'pmo' });
        if (this.userService.isAuhtorized(this.userService.EB_CL_MONEY_OBL_REPORT_VIEW))
            this.reportTypeList.unshift({ 'name': 'Client Money Obligations', 'code': 'cmo' });

        this.reportFormatList = this.params.getReportFormatTypeOptions();
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }

    ngOnInit() {
        this.addFromValidations();
    }

    ngAfterViewInit() { }

    initForm() {
        this.reportParams = new ReportParams();
        this.params = new Params();
        this.params.START_DATE = new Date();
        this.params.END_DATE = new Date();
        this.securityList = [];
        this.clientList = [];
        // this.reportTypeList = this.params.getSettlementReportOptions();
        this.clearFields();
    }

    public clearFields() {
        this.securityList = [];
        this.clientList = [];
        this.clientCustodianList = [];
        this.custodianExist = false;
        this.isSubmitted = false;
    }

    public printReport(model: any, isValid: boolean) {
        AppUtility.printConsole('in printReport, isValid: ' + isValid);
        this.isSubmitted = true;
        if (isValid) {
            this.loader.show();
            this.listingService.getClientPreSettlementDeliveryReport(AppConstants.participantId, this.selectedexchangeCode,
                this.settlementCalendarId, this.params.SETTLEMENT_TYPE, this.startDate, this.endDate, this.settlementDate, this.reportFormat.toLowerCase(), this.lang)
                .subscribe(
                    restData => {
                        this.loader.hide();
                        let reportData: any;
                        reportData = restData;
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

    public onDateChangeEvent(selectedDate): void {
        if (!AppUtility.isEmpty(selectedDate)) {
            this.params.EXCHANGE_ID = null;
            this.params.SETTLEMENT_TYPE = null;
        }
    }

    public onCalendarSelect() {
        this.loader.show();
        this.listingService.getSettlementCalendarByTradeDate(this.tradeDate.value, true, AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.settlementCalendarList = new wjcCore.CollectionView();
                        this.recExist = false;
                        this.settlementGrid.refresh();
                    } else {
                        this.settlementCalendarList = new wjcCore.CollectionView(restData);
                        this.recExist = true;
                    }
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error
                });
    }

    public updateControls() {
        this.Ex_ID = this.settlementGrid.collectionView.currentItem.exchange.exchangeId;
        this.selectedexchangeCode = this.settlementGrid.collectionView.currentItem.exchange.exchangeName; //  Defect Id # 553, QA wants exchange name istead of exchange code
        this.params.SETTLEMENT_TYPE = this.settlementGrid.collectionView.currentItem.settlementType.settlementType;
        this.startDate = this.settlementGrid.collectionView.currentItem.startDate;
        this.endDate = this.settlementGrid.collectionView.currentItem.endDate;
        this.settlementDate = this.settlementGrid.collectionView.currentItem.settlementDate;
        this.settlementCalendarId = this.settlementGrid.collectionView.currentItem.settlementCalendarId;
    }

    public getNotification(btnClicked) { }

    private addFromValidations() {
        this.myForm = this._fb.group({
            exchangeCode: ['', Validators.compose([Validators.required])],
            settlementType: ['', Validators.compose([Validators.required])],
            startDate: ['', Validators.compose([Validators.required])],
            endDate: ['', Validators.compose([Validators.required])],
            settlementDate: ['', Validators.compose([Validators.required])],
            reportFormat: ['', Validators.compose([Validators.required])],
            tradeDate: ['']
        });
    }
}