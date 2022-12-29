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

    selector: 'participant-levies-rpt',
    templateUrl:'./participant-levies-rpt.html',
    encapsulation: ViewEncapsulation.None,
})
export class ParticipantLeviesRpt implements OnInit {
    public myForm: FormGroup;
    public searchForm: FormGroup;

    //claims: any; 

    reportParams: ReportParams;
    params: Params;


    exchangeList: any[] = [];
    reportTypeList: any[] = [];

    data: any;

    reportType: string = null;
    exchangeId: number = 0;
    errorMessage: string;
    lang: any
    pdfSrc: String
    pdf = false
    fileNameForDownload = "ParticipantLeviesReport.pdf"
    public isSubmitted: boolean;

    @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    participantExchangeId: any;

    constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
        this.initForm();
        this.isSubmitted = false;
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

    /*********************************
   *      Public & Action Methods
   *********************************/
    initForm() {

        this.reportParams = new ReportParams();
        this.params = new Params();
        this.clearFields();
        this.reportTypeList = this.params.getLeviesReportOptions();
    }
    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        if (AppUtility.isValidVariable(this.searchForm)) {
            this.searchForm.markAsPristine();
        }

        this.isSubmitted = false;


    }

    loadexchangeList(): void {
        // update exchangeList data    
        this.listingService.getParticipantExchangeList(AppConstants.participantId).subscribe(
            data => {
                if (data != null) {
                    //console.log("exchangeList: "+ data); 
                    this.exchangeList = data;
                    //this.exchangeId = this.exchangeList[0].exchangeId;
                    var exchange: Exchange = new Exchange(AppConstants.PLEASE_SELECT_VAL, AppConstants.PLEASE_SELECT_STR, AppConstants.PLEASE_SELECT_STR);
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

    public printReport(model: any, isValid: boolean) {
        AppUtility.printConsole("onSave Action, isValid: " + isValid);
        //AppUtility.printConsole("Stock deposit:"+JSON.stringify(this.selectedItem)); 
        this.isSubmitted = true;

        if (isValid) {
            this.loader.show();
            //print report ... 
            // set parameters 
            this.params.PARTICIPANT_ID = AppConstants.participantId;
            var exchange: String = (this.params.EXCHANGE_ID == null || this.params.EXCHANGE_ID == -1) ? AppConstants.ALL_STR.toUpperCase() : this.cmbExchange.text;

            if (this.reportType.toLowerCase() == 'participant' || this.reportType.toLowerCase() == 'participante' ) {
                this.reportService.getParticipantLevies(this.params.PARTICIPANT_ID, this.params.EXCHANGE_ID, exchange, this.lang).subscribe(
                    restData => {
                        this.loader.hide();
                        var reportData: any;
                        reportData = restData;
                        //var w = window.open(reportData.reportBase64/*,"_self"*/);
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
            } else if (this.reportType.toLowerCase() == 'exchange' || this.reportType.toLowerCase() == 'intercambio') {
                this.reportService.getExchangeLevies(this.params.PARTICIPANT_ID, this.params.EXCHANGE_ID, exchange, this.lang).subscribe(
                    restData => {
                        this.loader.hide();
                        var reportData: any;
                        reportData = restData;
                        //var w = window.open(reportData.reportBase64/*,"_self"*/);
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

    }

    public getNotification(btnClicked) {
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            reportType: ['', Validators.compose([Validators.required])],
        });
    }

}