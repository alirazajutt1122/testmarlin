import { Component, ViewEncapsulation, ViewChild, Injector, ElementRef } from '@angular/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants } from 'app/app.utility';
import { Params, ReportParams } from 'app/models/report-params';


import { ReportService } from 'app/services/report.service';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';



// var downloadAPI = require('./../../../../../scripts/download-document');

@Component({
    selector: '[chart-of-account-rpt]',
    templateUrl: './chart-of-account-rpt.html',

    encapsulation: ViewEncapsulation.None,
})

export class ChartOfAccountRpt {

    @ViewChild('dialogCmp') dialogCmp: DialogCmp;

    reportParams: ReportParams;
    lang: any;
    pdfSrc: String
    pdf = false
	fileNameForDownload = "ChartOfAccountRpt.pdf"



    constructor(private appState: AppState, private reportService: ReportService, private translate: TranslateService,private loader : FuseLoaderScreenService) {
        this.reportParams = new ReportParams();
                //_______________________________for ngx_translate_________________________________________

                this.lang = localStorage.getItem("lang");
                if (this.lang == null) { this.lang = 'en' }
                this.translate.use(this.lang);
                //______________________________for ngxtranslate__________________________________________
            
    }

    printReport() {
        this.appState.showLoader = true;
        let params = new Params();
        params.PARTICIPANT_ID = AppConstants.participantId;
        this.reportParams.setParams(params);
        this.reportService.getChartOfAccounts(this.reportParams,this.lang)
        .subscribe(
        restData => {
            this.appState.showLoader = false;
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
            this.appState.showLoader = false;
            this.dialogCmp.statusMsg = error;
        this.dialogCmp.showAlartDialog('Error');
        });
    }

    public getNotification(btnClicked) {
  }
}

