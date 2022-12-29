'use strict';
import { Component, OnInit, AfterViewInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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
import { DialogCmp } from '../../user-site/dialog/dialog.component'
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { ApplicationSetup } from 'app/models/application-setup';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { VoucherType } from 'app/models/voucher-type';
import { ParticipantSettlementParams } from 'app/models/participant-settlement-params';
import { SettlementType } from 'app/models/settlement-type';
import { Participant } from 'app/models/participant';
import { Translation } from 'app/models/translation';
import { ParticipantParams } from 'app/models/participantParams';

declare var jQuery: any;

@Component({

    selector: 'application-setup',
    templateUrl: './application-setup-page.html',
})
export class ApplicationSetupPage implements OnInit, AfterViewInit {

    public myForm: FormGroup;
    public currentTab_: String = 'Financials';
    public chartOfAccountLevelError: boolean;
    public defaultSecurityHaircut: boolean;
    public compulsoryError: boolean;
    public fileSelectionMsgShow = false;
    public fileSizeExceed = false;
    public alertMessage: String;
    public glParamId: Number = null;
    public financialsTabDisabled: boolean;
    exchangeNameList: any[];
    voucherTypeList: any[];
    voucherTypeList_Misc: any[];
    settlementTypeList: any[];
    receivableCommissionPayablesList: any[] = [];
    chartOfAccountList: any[];
    clientControlAccountList: any[];
    unappropriatePLAccountList: any[];
    roundingDifferenceAccountList: any[];
    capitalGainAccountList: any[];
    settlementList: any[];
    languageList: any[];
    selectedItem: ApplicationSetup;

    reportHeaderLine1Params: ParticipantParams
    reportHeaderLine2Params: ParticipantParams
    reportHeaderLine3Params: ParticipantParams
    reportFooterLine1Params: ParticipantParams
    reportFooterLine2Params: ParticipantParams


    secondLanguageHeaderLine1: String;
    secondLanguageHeaderLine2: String;
    secondLanguageHeaderLine3: String;

    secondLanguageFooterLine1: String;
    secondLanguageFooterLine2: String;

    settlementDetailList: wjcCore.CollectionView = new wjcCore.CollectionView([]);
    lang: any
    pdfSrc: String
    pdf = false
    public chartofAccountNumbers: number = 1;
    errorMessage: string;

    ABC_ID = 1;
    //Constants
    public reportHeaderline1: String = 'Report Header Line 1';
    public reportHeaderline2: String = 'Report Header Line 2';
    public reportHeaderline3: String = 'Report Header Line 3';
    // public debitCreditDisplayMode: String = 'Debit/Credit Display Mode';
    public image: String = 'Image';
    public SMTPServer: String = 'SMTP Server';
    public _password: String = 'Password';
    public SMTPOutgoingEmail: String = 'SMTP Outgoing Email';
    public SMTPPort: String = 'SMTP Port';
    public numberOfRecordsGrid: String = 'Number of Records in Grid';
    public defaultSeurtiyHaircut: String = 'Default Security Haircut';
    public reportFooter1: String = 'Report Footer 1';
    public reportFooter2: String = 'Report Footer 2';
    //  Password Management
    public passwordStrength: String = 'Password Strength';
    public passwordHistoryDays: String = 'Password History (in Days)';
    public PasswordExpiryDays: String = 'Password Expiry (in Days)';
    public advanceAlertPasswordExpiryDays: String = 'Password Expiry Alert (in Days)';
    public UnsuccessfulLoginAttempts: String = 'Unsuccessfull Login Attempts';

    public cgt365DaysTaxPercentage: String = 'CGT 365 Days Tax Percentage';
    public individualCgtExpensePercentage: String = 'CGT 365 Days Expense Percentage';
    public cgtAbove365DaysTaxPercentage: String = 'CGT Above 365 Days Tax Percentage';
    public corporateCgtExpensePercentage: String = 'CGT Above 365 Days Expense Percentage';


    public settlementTypeId = AppConstants.PLEASE_SELECT_VAL;
    private fileContentType_: String = '';
    private file_srcs: string[] = [];
    public fileName_: String = '';
    public logoFullPath: String = '';
    public editDetailEquity: boolean = false;
    public deleteDetailEquity: boolean = false;
    public smtpInputError: boolean = false;
    claims: any;
    public dataPopulated: boolean = false;
    private clientControlAccountId: number;
    private unappropriatePLaccountId: number;
    private roundingDifferenceAccountId: number;
    private capitalGainAccountId: number;
    private voucherTypeId_Misc: number;

    private originalPassword: String = '';
    private dummyPassword: String = AppConstants.Dummy_Password;
    private onTabClick: number = 0;
    language1TypeId: String
    language2TypeId: String
    language2FooterTypeId: String




    password_Strength: Number = 1
    password_Strength_String: String
    password_History: Number = 10
    password_Expiry: Number = 30
    password_ExpiryAlerts: Number = 3
    Unsuccessfull_LoginAttempts: Number = 3
    formatLabel(value: number) {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return value;
    }



    @ViewChild('FinancialsAnchorTag') FinancialsAnchorTag: ElementRef;
    @ViewChild('EquitiesAnchorTag') EquitiesAnchorTag: ElementRef;
    @ViewChild('StationeryAnchorTag') StationeryAnchorTag: ElementRef;
    @ViewChild('EmailAnchorTag') EmailAnchorTag: ElementRef;
    @ViewChild('MiscellaneousAnchorTag') MiscellaneousAnchorTag: ElementRef;
    @ViewChild('ContractAnchorTag') ContractAnchorTag: ElementRef;
    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('flexDetail') flexDetail: wjcGrid.FlexGrid;
    @ViewChild('password') password: ElementRef;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;

    public tabFocusChanged() {
        this.password.nativeElement.focus();
    }

    private fileInput_: any;

    constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, renderer: Renderer2,
        elementRef: ElementRef, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
        // Listen to click events in the component
        this.claims = userService.claims;
        renderer.listen(elementRef.nativeElement, 'click', (event) => {
            this.flex.invalidate();
            this.flexDetail.invalidate();
        });
        this.clearFields();
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }


    ngOnInit() {
        this.addFromValidations();
        this.populateUnappropriatePLAccountList();

        this.populateChartOfAccountList();

        this.populateVoucherTypeList();

        this.populateSettlementTypeList();

        this.populateSettlementList();

        this.populateClientControlAccountList();

        this.populateExchangeList();

        this.populateReceivableCommissionPayables();

        this.getFinacialsDisabledFlag();

        this.populateLanguageList();

        // prevent editing in 1st row
        this.flex?.beginningEdit.addHandler(function (sender, e: any) {
            sender.updatedView.removeAllHandlers();
            if (e.row == 0 && e.col == 1)
                e.cancel = true;
        });

        // checking if the value is greater than 100 or less 1
        this.flex?.cellEditEnding.addHandler(function (sender, e: any) {

            sender.updatedView.addHandler(function (_s, _e) {
                _s.invalidate();
            });
            // get old and new values
            var flex = sender,
                newVal: any
            // oldVal = flex.getCellData(e.row, e.col),
            newVal = flex.activeEditor.value;

            if (newVal > 100 || newVal < 1)
                e.cancel = true;
        });

        this.flex?.updatedView.addHandler(function (sender, e) {
            sender.invalidate();
        });


    }

    ngAfterViewInit() {
        this.loader.show();
        this.populateApplicationSetup();


        this.FinancialsAnchorTag.nativeElement.click();
        this.currentTab_ = 'Financials';
        // jQuery('.js-slider').slider();

        jQuery('#pwdStrength').on('slide', function (slideEvt) {
            jQuery('#pwdStrengthVal').text(slideEvt.value === 1 ? 'Low' : slideEvt.value === 2 ? 'Medium' : 'High');
        });
        jQuery('#pwdHistory').on('slide', function (slideEvt) {
            jQuery('#pwdHistoryVal').text(slideEvt.value);
        });
        jQuery('#pwdExpiry').on('slide', function (slideEvt) {
            jQuery('#pwdExpiryVal').text(slideEvt.value);
        });
        jQuery('#advanceAlertPwdExpiry').on('slide', function (slideEvt) {
            jQuery('#advanceAlertPwdExpiryVal').text(slideEvt.value);
        });
        jQuery('#unsuccessfulLogins').on('slide', function (slideEvt) {
            jQuery('#unsuccessfulLoginsVal').text(slideEvt.value);
        });

        // jQuery('#pwdStrength').slider();
        // jQuery('#pwdHistory').slider();
        // jQuery('#pwdExpiry').slider();
        // jQuery('#advanceAlertPwdExpiry').slider();
        // jQuery('#unsuccessfulLogins').slider();
    }
    /*********************************
   *      Public & Action Methods
   *********************************/
    fileChangeEvent(input) {
        this.file_srcs = [];
        if (AppUtility.isEmpty(input)) {
            this.fileSelectionMsgShow = true;
            return;
        } else
            this.fileSelectionMsgShow = false;

        if (!AppUtility.isEmpty(input.files[0])) {
            if (input.files[0].size > 2000000) {
                this.fileSizeExceed = true;
                return;
            } else {
                this.fileSizeExceed = false;
                this.fileContentType_ = input.files[0].type;
            }
        } else {
            this.file_srcs = [];
            return;
        }



        var fullPath = input.value;
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            this.fileName_ = filename;
        }
        var _validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
        if (this.fileName_.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
                var sCurExtension = _validFileExtensions[j];
                if (this.fileName_.substr(this.fileName_.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }
            if (!blnValid) {
                this.dialogCmp.statusMsg = 'Sorry, ' + this.fileName_ + ' is invalid, allowed extensions are: ' + _validFileExtensions.join(', ');
                this.dialogCmp.showAlartDialog('Warning');

                this.fileName_ = '';
                this.fileContentType_ = '';
                input.value = '';
                return;
            }
        }

        this.readFiles(input.files);
        this.fileInput_ = input;
        this.selectedItem.companyLogoBase64_ = input; //this.file_srcs[0];

    }

    readFile(file, reader, callback) {
        // Set a callback funtion to fire after the file is fully loaded
        reader.onload = () => {
            // callback with the results
            callback(reader.result);
        }

        // Read the file
        reader.readAsDataURL(file);
    }

    readFiles(files, index = 0) {
        // Create the file reader
        let reader = new FileReader();

        // If there is a file
        if (index in files) {
            // Start reading this file
            this.readFile(files[index], reader, (result) => {
                // After the callback fires do:
                this.file_srcs = [];
                this.selectedItem.companyLogoBase64_ = result;
                this.file_srcs.push(result);
                this.readFiles(files, index + 1);// Read the next file;
            });
        } else {
            // When all files are done This forces a change detection
            this.changeDetectorRef.detectChanges();
        }
    }

    public onCancelAction() {
        this.clearFields();
    }

    public onAddNewRow() {
        this.markDirtyEquitiesTabControls();
        this.validateEquitiesTabControl(true);
        if (this.checkEquityTab()) {
            let id: any = this.editDetailEquity ? this.selectedItem.receivables.participantParamId : null;
            if (this.equityUnique(this.selectedItem.exchange.exchangeId.valueOf(), this.settlementTypeId.toString(), id, this.selectedItem.settlementType.settlementTypeId)) {
                if (!this.editDetailEquity)
                    this.settlementDetailList.items.push(this.recordToFlexDetailGrid());
                else {
                    let temp: any = this.settlementDetailList.currentItem;
                    let index: number = this.settlementDetailList.items.findIndex(function (obj) {
                        return obj.paramCode == temp.paramCode
                            && obj.voucherNaration == temp.voucherNaration
                            && obj.exchange.exchangeId == temp.exchange.exchangeId
                            && obj.chartOfAccount.chartOfAccountId == temp.chartOfAccount.chartOfAccountId
                            && obj.voucherType.voucherTypeId && temp.voucherType.voucherTypeId
                            && obj.settlementType.settlementTypeId && temp.settlementType.settlementTypeId
                    });
                    if (index > -1) {
                        this.settlementDetailList.items.splice(index, 1);
                    }
                    this.settlementDetailList.items.push(this.recordToFlexDetailGrid());
                }
                this.AllowingEdit();
                this.settlementDetailList.refresh();
                this.onResetAction();
                this.editDetailEquity = false;
            }
            else {
                this.dialogCmp.statusMsg = 'already exist';
                this.dialogCmp.showAlartDialog('Warning');
            }
        }
    }
    public onEditDetailAction() {
        this.editDetailEquity = true;
        this.deleteDetailEquity = false;
        let temp = this.settlementDetailList.currentItem;
        this.selectedItem.receivables.participantParamId = temp.paramId != null ? temp.paramId : null;
        this.settlementTypeId = temp.paramCode;
        this.selectedItem.receivables.voucherDescription = temp.voucherNaration;
        this.selectedItem.receivables.glAccount.chartOfAccountId = temp.chartOfAccount.chartOfAccountId;
        this.selectedItem.exchange.exchangeId = temp.exchange.exchangeId;
        this.selectedItem.receivables.voucherType.voucherTypeId = temp.voucherType.voucherTypeId;
        this.selectedItem.settlementType.settlementTypeId = temp.settlementType.settlementTypeId;
    }

    public onEditDetailDelete() {
        this.deleteDetailEquity = true;
        if (this.settlementDetailList.currentItem.paramId == null) {
            this.editDetailEquity = false;
            const index = this.settlementDetailList.items.findIndex(
                item => item.exchange.exchangeId == this.settlementDetailList.currentItem.exchange.exchangeId &&
                    item.paramCode == this.settlementDetailList.currentItem.paramCode);

            this.settlementDetailList.items.splice(index, 1);
            this.settlementDetailList.refresh();
        } else {
            this.dialogCmp.statusMsg = 'Please move the focus to desired row.';
            this.dialogCmp.showAlartDialog('Warning');
        }
    }

    private equityUnique(exchangeId: number, paramCode: string, id: any, settlementTypeId: Number): boolean {
        if (AppUtility.isValidVariable(this.settlementDetailList) && AppUtility.isEmptyArray(this.settlementDetailList.items))
            return true;
        let l: number = -1;
        if (!this.editDetailEquity) {
            // add case
            l = this.settlementDetailList.items.filter(function (obj) {
                return obj.paramCode == paramCode && obj.exchange.exchangeId == exchangeId && obj.settlementType.settlementTypeId == settlementTypeId;
            }).length;
            return l == 0;
        }
        else {
            let orignalArray: any[] = [];// JSON.parse(JSON.stringify(this.settlementDetailList.items));
            for (let i: number = 0; i < this.settlementDetailList.items.length; i++) {
                orignalArray.push(JSON.parse(JSON.stringify(this.settlementDetailList.items[i])));
            }

            let temp: any = this.settlementDetailList.currentItem;
            let index: number = orignalArray.findIndex(function (obj) {
                return obj.paramCode == temp.paramCode
                    && obj.voucherNaration == temp.voucherNaration
                    && obj.exchange.exchangeId == temp.exchange.exchangeId
                    && obj.chartOfAccount.chartOfAccountId == temp.chartOfAccount.chartOfAccountId
                    && obj.voucherType.voucherTypeId && temp.voucherType.voucherTypeId
                    && obj.settlementType.settlementTypeId && temp.settlementType.settlementTypeId
            });
            if (index > -1) {
                orignalArray.splice(index, 1);
            }

            let o: number = orignalArray.filter(function (obj) {
                return obj.paramCode == paramCode && obj.exchange.exchangeId == exchangeId && obj.settlementType.settlementTypeId == settlementTypeId;
            }).length;
            return o == 0;
        }
    }
    public recordToFlexDetailGrid() {
        return {
            'paramId': this.editDetailEquity ? this.selectedItem.receivables.participantParamId : null,
            'paramCode': this.settlementTypeId,
            'voucherNaration': this.selectedItem.receivables.voucherDescription,
            'chartOfAccount': {
                'chartOfAccountId': this.selectedItem.receivables.glAccount.chartOfAccountId,
                'glCodeDisplayName_': this.getGLCodeDisplayName(this.selectedItem.receivables.glAccount.chartOfAccountId.valueOf())
            },
            'exchange': {
                'exchangeId': this.selectedItem.exchange.exchangeId,
                'exchangeName': this.getExchangeName(this.selectedItem.exchange.exchangeId.valueOf())
            },
            'participant': {
                'participantId': AppConstants.participantId
            },
            'voucherType': {
                'voucherTypeId': this.selectedItem.receivables.voucherType.voucherTypeId,
                'displayName_': this.getVoucherTypeDisplayName(this.selectedItem.receivables.voucherType.voucherTypeId.valueOf())
            },
            'settlementType': {
                'settlementTypeId': this.selectedItem.settlementType.settlementTypeId,
                'settlementType': this.getSettlementTypeDisplayName(this.selectedItem.settlementType.settlementTypeId.valueOf())
            },
            'paramCodeDisplay': this.getParamCode(this.settlementTypeId.toString())
        };
    }

    private getGLCodeDisplayName(glCodeId: number) {
        return this.chartOfAccountList.filter(function (obj) {
            return obj.chartOfAccountId == glCodeId;
        })[0].glCodeDisplayName_;
    }
    private getSettlementTypeDisplayName(settlementTypeId: number) {
        return this.settlementTypeList.filter(function (obj) {
            return obj.settlementTypeId == settlementTypeId;
        })[0].settlementType;
    }
    private getExchangeName(exchangeId: number) {
        return this.exchangeNameList.filter(function (obj) {
            return obj.exchangeId == exchangeId;
        })[0].exchangeName;
    }

    private getVoucherTypeDisplayName(voucherTypeId: number) {
        return this.voucherTypeList.filter(function (obj) {
            return obj.voucherTypeId == voucherTypeId;
        })[0].displayName_;
    }

    private getParamCode(paramCode: string) {
        return this.settlementList.filter(function (obj) {
            return obj.paramCode == paramCode;
        })[0].paramName;
    }

    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm))
            this.myForm.markAsPristine();

        if (AppUtility.isValidVariable(this.settlementDetailList)) {
            this.settlementDetailList.cancelEdit();
            this.settlementDetailList.cancelNew();
        }
        if (!AppUtility.isEmptyArray(this.languageList)) {
            this.language1TypeId = this.languageList[1].languageCode;
        }
        if (!AppUtility.isEmptyArray(this.languageList)) {
            this.language2TypeId = this.languageList[2].languageCode;
        }
        if (!AppUtility.isEmptyArray(this.languageList)) {
            this.language2FooterTypeId = this.languageList[2].languageCode;
        }
        this.editDetailEquity = false;
        this.deleteDetailEquity = false;
        this.financialsTabDisabled = false;
        this.chartOfAccountLevelError = false;
        this.defaultSecurityHaircut = false;

        this.reportHeaderLine1Params = new ParticipantParams();
        this.reportHeaderLine2Params = new ParticipantParams();
        this.reportHeaderLine3Params = new ParticipantParams();
        this.reportFooterLine1Params = new ParticipantParams();
        this.reportFooterLine2Params = new ParticipantParams();


        this.selectedItem = new ApplicationSetup();
        this.selectedItem.chartOfAccountLevel = 1;
        this.selectedItem.chartOfAccountLevelCodeLength = [];
        this.selectedItem.voucherNoResetPolicyMonthYear = true;
        this.selectedItem.voucherBackDateEntry = true;
        this.alertMessage = '';
        this.compulsoryError = false;
        this.clearFieldsEquity();

        this.chartofAccountNumbers = 1;

        this.selectedItem.participant = new Participant();
        this.selectedItem.participant.participantId = AppConstants.participantId;
        this.selectedItem.participant.participantName = this.claims.sub;
        this.selectedItem.participant.exchange = null;
        this.selectedItem.participant.displayName_ = this.claims.sub;

        this.fileSelectionMsgShow = false;
        this.fileSizeExceed = false;
        this.fileContentType_ = '';
        this.file_srcs = [];
        this.fileName_ = '';

        this.clearFieldsMiscellaneous();

        this.selectedItem.reportHeaderLine1 = '';
        this.selectedItem.reportHeaderLine2 = '';
        this.selectedItem.reportHeaderLine3 = '';
        // this.selectedItem.debitCreditDisplayMode = true;
        this.selectedItem.companyLogoBase64_ = '';

        this.smtpInputError = false;

        this.selectedItem.smtpServer = '';
        this.selectedItem.password = '';
        this.selectedItem.smtpOutgoingEmail = '';
        this.selectedItem.smtpPort = '';

        this.selectedItem.reportFooter1 = '';
        this.selectedItem.reportFooter2 = '';
    }

    public clearFieldsMiscellaneous() {
        this.selectedItem.clientControlAccount = new ChartOfAccount();
        if (!AppUtility.isEmptyArray(this.clientControlAccountList)) {
            this.selectedItem.clientControlAccount.glCodeDisplayName_ = this.clientControlAccountList[0].glCodeDisplayName_;
            this.selectedItem.clientControlAccount.chartOfAccountId = this.clientControlAccountList[0].chartOfAccountId;
        }

        this.selectedItem.unappropriatePLaccount = new ChartOfAccount();
        if (!AppUtility.isEmptyArray(this.unappropriatePLAccountList)) {
            this.selectedItem.unappropriatePLaccount.glCodeDisplayName_ = this.unappropriatePLAccountList[0].glCodeDisplayName_;
            this.selectedItem.unappropriatePLaccount.chartOfAccountId = this.unappropriatePLAccountList[0].chartOfAccountId;
        }

        this.selectedItem.roundingDifferenceAccount = new ChartOfAccount();
        if (!AppUtility.isEmptyArray(this.roundingDifferenceAccountList)) {
            this.selectedItem.roundingDifferenceAccount.glCodeDisplayName_ = this.roundingDifferenceAccountList[0].glCodeDisplayName_;
            this.selectedItem.roundingDifferenceAccount.chartOfAccountId = this.roundingDifferenceAccountList[0].chartOfAccountId;
        }

        this.selectedItem.defaultSecutrityHairCut = 0;

        this.selectedItem.capitalGainAccount = new ChartOfAccount();
        if (!AppUtility.isEmptyArray(this.capitalGainAccountList)) {
            this.selectedItem.capitalGainAccount.glCodeDisplayName_ = this.capitalGainAccountList[0].glCodeDisplayName_;
            this.selectedItem.capitalGainAccount.chartOfAccountId = this.capitalGainAccountList[0].chartOfAccountId;
        }

        this.selectedItem.voucherType_Misc = new VoucherType();
        if (!AppUtility.isEmptyArray(this.voucherTypeList_Misc)) {
            this.selectedItem.voucherType_Misc.voucherType = this.voucherTypeList_Misc[0].voucherType;
            this.selectedItem.voucherType_Misc.voucherTypeId = this.voucherTypeList_Misc[0].voucherTypeId;
        }
    }

    public clearFieldsEquity() {
        this.selectedItem.exchange = new Exchange();
        if (!AppUtility.isEmptyArray(this.exchangeNameList)) {
            this.selectedItem.exchange.exchangeId = this.exchangeNameList[0].exchangeId;
            this.selectedItem.exchange.exchangeName = this.exchangeNameList[0].exchangeName;
            this.selectedItem.exchange.exchangeCode = this.exchangeNameList[0].exchangeCode;
            this.selectedItem.exchange.contactDetail = this.exchangeNameList[0].contactDetail;
        }
        this.selectedItem.receivables = new ParticipantSettlementParams();
        this.selectedItem.receivables.voucherType = new VoucherType();
        if (!AppUtility.isEmptyArray(this.voucherTypeList)) {
            this.selectedItem.receivables.voucherType.voucherType = this.voucherTypeList[0].voucherType;
            this.selectedItem.receivables.voucherType.voucherTypeId = this.voucherTypeList[0].voucherTypeId;
        }
        this.selectedItem.receivables.glAccount = new ChartOfAccount();
        if (!AppUtility.isEmptyArray(this.chartOfAccountList)) {
            this.selectedItem.receivables.glAccount.glCodeDisplayName_ = this.chartOfAccountList[0].glCodeDisplayName_;
            this.selectedItem.receivables.glAccount.chartOfAccountId = this.chartOfAccountList[0].chartOfAccountId;
        }
        this.selectedItem.receivables.voucherDescription = '';
        this.selectedItem.receivables.participantParamId = null;

        if (!AppUtility.isEmptyArray(this.settlementList)) {
            this.settlementTypeId = this.settlementList[0].paramCode;
        }
        this.selectedItem.settlementType = new SettlementType();
        if (!AppUtility.isEmptyArray(this.settlementTypeList)) {
            this.selectedItem.settlementType.settlementType = this.settlementTypeList[0].settlementType;;
            this.selectedItem.settlementType.settlementTypeId = this.settlementTypeList[0].settlementTypeId;;
        }

    }

    public onChartOfAccountLevelChange(chartOfAccountLevel: Number) {
        if (AppUtility.isValidVariable(chartOfAccountLevel)) {
            if (chartOfAccountLevel.valueOf() < 1 || chartOfAccountLevel.valueOf() > 9) {
                this.chartOfAccountLevelError = true;
                this.selectedItem.chartOfAccountLevel = chartOfAccountLevel;
                this.selectedItem.chartOfAccountLevelCodeLength = [];
                this.selectedItem.chartOfAccountLevelCodeLength.push({ 'level': 1, 'length': 2 });
                this.flex?.refresh();
            }
            else {
                if (!this.financialsTabDisabled) {
                    this.chartOfAccountLevelError = false;
                    if (!this.dataPopulated) {
                        this.selectedItem.chartOfAccountLevelCodeLength = [];
                        this.selectedItem.chartOfAccountLevelCodeLength.push({ 'level': 1, 'length': 2 });
                        for (let i: number = 1; i < chartOfAccountLevel; i++)
                            this.selectedItem.chartOfAccountLevelCodeLength.push({ 'level': i + 1, 'length': '' });
                        this.flex?.refresh();
                    }
                    this.dataPopulated = false;
                }
            }
        }
    }
    public onDefaultSecurityHaircutChange(numberOfRecordsInGrid: Number) {
        if (numberOfRecordsInGrid.valueOf() < 0 || numberOfRecordsInGrid.valueOf() > 100)
            this.defaultSecurityHaircut = true;
        else {
            this.defaultSecurityHaircut = false;
        }
    }

    public closeAlert() {
        this.compulsoryError = false;
    }

    public onTabChangeEvent(currentTab) {

        this.currentTab_ = currentTab;

        if (this.currentTab_ == 'Stationery' || this.currentTab_ == 'Financials' || this.currentTab_ == 'Email' || this.currentTab_ == 'Contract') {
            this.validateCompulsoryControls(true);
        }
        else if (this.currentTab_ == 'Equities') {
            this.validateEquitiesTabControl(false);
            this.markPrestineEquitiesTabControls(false);
            this.selectedItem.exchange.exchangeId = AppConstants.PLEASE_SELECT_VAL;
            //            (<any>this.myForm).controls.exchangeName.updateValueAndValidity();
        }
        else if (this.currentTab_ == 'Miscellaneous') {
            debugger
            this.selectedItem.clientControlAccount.chartOfAccountId = this.clientControlAccountId;
            // this.selectedItem.clientControlAccount.chartOfAccountId = 2628 //included in the list
            // this.selectedItem.clientControlAccount.chartOfAccountId = 2538 //not in the list 
            this.selectedItem.unappropriatePLaccount.chartOfAccountId = this.unappropriatePLaccountId;
            this.selectedItem.roundingDifferenceAccount.chartOfAccountId = this.roundingDifferenceAccountId;
            this.selectedItem.capitalGainAccount.chartOfAccountId = this.capitalGainAccountId;
            this.selectedItem.voucherType_Misc.voucherTypeId = this.voucherTypeId_Misc;

            if (this.onTabClick == 0) {
                this.onTabClick = 1;
                this.onTabChangeEvent('Miscellaneous');

            }

            (<any>this.myForm).controls.clientControlAccount.updateValueAndValidity();
            (<any>this.myForm).controls.unappropriatePLAccount.updateValueAndValidity();
            (<any>this.myForm).controls.roundingDifferenceAccount.updateValueAndValidity();
            (<any>this.myForm).controls.capitalGainAccount.updateValueAndValidity();
            (<any>this.myForm).controls.voucherType_Misc.updateValueAndValidity();
            this.validateCompulsoryControls(false);
        }
        else { }
    }

    public onVoucherNoResetPolicyMonthYearChangeEvent(flag: boolean) {
        this.selectedItem.voucherNoResetPolicyMonthYear = flag;
    }

    public onVoucherBackDateEntryChangeEvent(flag: boolean) {
        this.selectedItem.voucherBackDateEntry = flag;
    }

    public validateCompulsoryControls(_flag: boolean) {
        if (_flag) {
            this.setCompulsoryValidators();
            this.validateEquitiesTabControl(false);
        }
        else {
            (<any>this.myForm).controls.reportHeaderLine1.setValidators(null);
            (<any>this.myForm).controls.reportHeaderLine1.updateValueAndValidity();

            (<any>this.myForm).controls.reportHeaderLine2.setValidators(null);
            (<any>this.myForm).controls.reportHeaderLine2.updateValueAndValidity();

            (<any>this.myForm).controls.reportHeaderLine3.setValidators(null);
            (<any>this.myForm).controls.reportHeaderLine3.updateValueAndValidity();

            (<any>this.myForm).controls.smtpServer.setValidators(null);
            (<any>this.myForm).controls.smtpServer.updateValueAndValidity();

            (<any>this.myForm).controls.password.setValidators(null);
            (<any>this.myForm).controls.password.updateValueAndValidity();

            (<any>this.myForm).controls.smtpEmail.setValidators(null);
            (<any>this.myForm).controls.smtpEmail.updateValueAndValidity();

            (<any>this.myForm).controls.smtpPort.setValidators(null);
            (<any>this.myForm).controls.smtpPort.updateValueAndValidity();

            (<any>this.myForm).controls.reportFooter1.setValidators(null);
            (<any>this.myForm).controls.reportFooter1.updateValueAndValidity();

            (<any>this.myForm).controls.reportFooter2.setValidators(null);
            (<any>this.myForm).controls.reportFooter2.updateValueAndValidity();

        }
    }
    // if flag true => validate, else invalidate
    public validateEquitiesTabControl(_flag: boolean) {
        if (_flag) {
            (<any>this.myForm).controls.exchangeName.setValidators([Validators.required]);
            (<any>this.myForm).controls.exchangeName.updateValueAndValidity();

            (<any>this.myForm).controls.voucherTypeIdR.setValidators([Validators.required]);
            (<any>this.myForm).controls.voucherTypeIdR.updateValueAndValidity();

            (<any>this.myForm).controls.chartOfAccountIdR.setValidators([Validators.required]);
            (<any>this.myForm).controls.chartOfAccountIdR.updateValueAndValidity();

            (<any>this.myForm).controls.vouNarationR.setValidators([Validators.required]);
            (<any>this.myForm).controls.vouNarationR.updateValueAndValidity();

            (<any>this.myForm).controls.settlement.setValidators([Validators.required]);
            (<any>this.myForm).controls.settlement.updateValueAndValidity();

            (<any>this.myForm).controls.settlementType.setValidators([Validators.required]);
            (<any>this.myForm).controls.settlementType.updateValueAndValidity();

            this.validateCompulsoryControls(false);
        }
        else {
            (<any>this.myForm).controls.exchangeName.setValidators(null);
            (<any>this.myForm).controls.exchangeName.updateValueAndValidity();

            (<any>this.myForm).controls.voucherTypeIdR.setValidators(null);
            (<any>this.myForm).controls.voucherTypeIdR.updateValueAndValidity();

            (<any>this.myForm).controls.chartOfAccountIdR.setValidators(null);
            (<any>this.myForm).controls.chartOfAccountIdR.updateValueAndValidity();

            (<any>this.myForm).controls.settlement.setValidators(null);
            (<any>this.myForm).controls.settlement.updateValueAndValidity();

            (<any>this.myForm).controls.settlementType.setValidators(null);
            (<any>this.myForm).controls.settlementType.updateValueAndValidity();

            (<any>this.myForm).controls.vouNarationR.setValidators(null);
            (<any>this.myForm).controls.vouNarationR.updateValueAndValidity();
        }
    }

    public markDirtyStationeryTabControls() {
        (<any>this.myForm).controls.reportHeaderLine1.markAsDirty();
        (<any>this.myForm).controls.reportHeaderLine2.markAsDirty();
        (<any>this.myForm).controls.reportHeaderLine3.markAsDirty();
        if (this.file_srcs.length == 0 || this.fileSizeExceed)
            this.fileSelectionMsgShow = true;
    }

    public markDirtyContractNoteTabControls() {
        (<any>this.myForm).controls.reportFooter1.markAsDirty();
        (<any>this.myForm).controls.reportFooter2.markAsDirty();
    }

    // if flag true => reset, else mark as prestine.
    public markPrestineStationeryTabControls(_flag: boolean) {
        if (_flag) {
            (<any>this.myForm).controls.reportHeaderLine1.reset('');
            (<any>this.myForm).controls.reportHeaderLine2.reset('');
            (<any>this.myForm).controls.reportHeaderLine3.reset('');
            (<any>this.myForm).controls.fileUpload.reset();
            this.file_srcs = [];
            this.fileSizeExceed = false;
            this.fileSelectionMsgShow = false;
        }
        else {
            (<any>this.myForm).controls.reportHeaderLine1.markAsPristine();
            (<any>this.myForm).controls.reportHeaderLine2.markAsPristine();
            (<any>this.myForm).controls.reportHeaderLine3.markAsPristine();
        }
    }

    public markDirtyEmailTabControls() {
        (<any>this.myForm).controls.smtpServer.markAsDirty();
        (<any>this.myForm).controls.password.markAsDirty();
        (<any>this.myForm).controls.smtpEmail.markAsDirty();
        (<any>this.myForm).controls.smtpPort.markAsDirty();
    }

    // if flag true => reset, else mark as prestine.
    public markPrestineEmailTabControls(_flag: boolean) {
        if (_flag) {
            (<any>this.myForm).controls.smtpServer.reset('');
            (<any>this.myForm).controls.password.reset('');
            (<any>this.myForm).controls.smtpEmail.reset('');
            (<any>this.myForm).controls.smtpPort.reset('');
        }
        else {
            (<any>this.myForm).controls.smtpServer.markAsPristine();
            (<any>this.myForm).controls.password.markAsPristine();
            (<any>this.myForm).controls.smtpEmail.markAsPristine();
            (<any>this.myForm).controls.smtpPort.markAsPristine();
        }
    }

    public markDirtyEquitiesTabControls() {
        (<any>this.myForm).controls.exchangeName.markAsDirty();
        (<any>this.myForm).controls.voucherTypeIdR.markAsDirty();
        (<any>this.myForm).controls.chartOfAccountIdR.markAsDirty();
        (<any>this.myForm).controls.vouNarationR.markAsDirty();
        (<any>this.myForm).controls.settlement.markAsDirty();
        (<any>this.myForm).controls.settlementType.markAsDirty();
    }

    public markPrestineEquitiesTabControls(_flag: boolean) {
        if (_flag) {
            this.settlementTypeId = AppConstants.PLEASE_SELECT_VAL;
            (<any>this.myForm).controls.exchangeName.reset();
            (<any>this.myForm).controls.voucherTypeIdR.reset();
            (<any>this.myForm).controls.chartOfAccountIdR.reset();
            (<any>this.myForm).controls.vouNarationR.reset('');
            (<any>this.myForm).controls.settlement.reset();
            (<any>this.myForm).controls.settlementType.reset();
        }
        else {
            (<any>this.myForm).controls.exchangeName.markAsPristine();
            (<any>this.myForm).controls.voucherTypeIdR.markAsPristine();
            (<any>this.myForm).controls.chartOfAccountIdR.markAsPristine();
            (<any>this.myForm).controls.vouNarationR.markAsPristine();
            (<any>this.myForm).controls.settlement.markAsPristine();
            (<any>this.myForm).controls.settlementType.markAsPristine();
        }
    }

    public markPrestineContractNoteTabControls(_flag: boolean) {
        if (_flag) {
            (<any>this.myForm).controls.reportFooter1.reset('');
            (<any>this.myForm).controls.reportFooter2.reset('');
        }
        else {
            (<any>this.myForm).controls.reportFooter1.markAsPristine();
            (<any>this.myForm).controls.reportFooter2.markAsPristine();
        }
    }

    public onResetAction() {
        if (this.currentTab_ == 'Stationery') {
            // this.selectedItem.debitCreditDisplayMode = true;
            this.selectedItem.companyLogoBase64_ = '';
            this.markPrestineStationeryTabControls(true);
        }
        else if (this.currentTab_ == 'Financials') {
            if (this.financialsTabDisabled) {      // to be changed after wards
                this.selectedItem.voucherBackDateEntry = true;
            }
            else {
                this.selectedItem.chartOfAccountLevel = 1;
                this.chartofAccountNumbers = 1;
                this.selectedItem.chartOfAccountLevelCodeLength = [];
                this.selectedItem.chartOfAccountLevelCodeLength.push({ 'level': 1, 'length': 2 });
                this.selectedItem.chartOfAccountLevelCodeLength.push({ 'level': 2, 'length': '' });
                this.selectedItem.voucherNoResetPolicyMonthYear = true;
                this.selectedItem.voucherBackDateEntry = true;
            }
        }
        else if (this.currentTab_ == 'Email') {
            this.markPrestineEmailTabControls(true);
        }
        else if (this.currentTab_ == 'Equities') {
            this.clearFieldsEquity();
            this.markPrestineEquitiesTabControls(true);
        }
        else if (this.currentTab_ == 'Miscellaneous') {
            this.clearFieldsMiscellaneous();
        }
        else {
            this.markPrestineContractNoteTabControls(true);
        }
    }

    public getParticipantParams(): any {

        let participantParams: any[] = [];
        this.selectedItem.passwordStrength = this.password_Strength;
        this.selectedItem.passwordStrengthString = this.selectedItem.passwordStrength === 1 ? 'L' : this.selectedItem.passwordStrength === 2 ? 'M' : 'H';
        this.password_Strength_String = this.selectedItem.passwordStrengthString
        this.selectedItem.passwordHistoryDays = this.password_History;
        this.selectedItem.passwordExpiryDays = this.password_Expiry;
        this.selectedItem.advanceAlertPasswordExpiryDays = this.password_ExpiryAlerts;
        this.selectedItem.unsuccessfulLoginAttempts = this.Unsuccessfull_LoginAttempts;
        // .....................................................................
        let translationList1: any[] = []
        let translationList2: any[] = []
        let translationList3: any[] = []
        let translationList4: any[] = []
        let translationList5: any[] = []

        // ReportHeaderLine1
        let langId
        if (this.language2TypeId == 'pt')
            langId = 2
        else if ((this.language2TypeId == 'en'))
            langId = 1
        else
            langId = 0


        let langIdFooter
        if (this.language2FooterTypeId == 'pt')
            langIdFooter = 2
        else if ((this.language2FooterTypeId == 'en'))
            langIdFooter = 1
        else
            langIdFooter = 0

        // ReportHeaderLine1 First-Lang
        let param1: Translation = new Translation()
        param1.translationsId = this.reportHeaderLine1Params.translations[0].translationId
        param1.textContentId = this.reportHeaderLine1Params.translations[0].textContentId

        param1.translation = this.selectedItem.reportHeaderLine1
        param1.languageCode = this.languageList[1].languageCode
        param1.columnKey = "PARAM_VALUE"
        param1.language.languageId = this.languageList[1].languageId
        param1.language.languageCode = this.languageList[1].languageCode
        param1.language.languageName = this.languageList[1].languageName
        param1.language.countryCode = this.languageList[1].countryCode
        translationList1.push(param1)

        // ReportHeaderLine1 Second-Lang
        let param2: Translation = new Translation()
        param2.translationsId = this.reportHeaderLine1Params.translations[1].translationId
        param2.textContentId = this.reportHeaderLine1Params.translations[1].textContentId

        param2.translation = this.secondLanguageHeaderLine1
        param2.languageCode = this.languageList[langId].languageCode
        param2.columnKey = "PARAM_VALUE"
        param2.language.languageId = this.languageList[langId].languageId
        param2.language.languageCode = this.languageList[langId].languageCode
        param2.language.languageName = this.languageList[langId].languageName
        param2.language.countryCode = this.languageList[langId].countryCode
        translationList1.push(param2)



        // ReportHeaderLine2 First-Lang
        let param3: Translation = new Translation()
        param3.translationsId = this.reportHeaderLine2Params.translations[0].translationId
        param3.textContentId = this.reportHeaderLine2Params.translations[0].textContentId

        param3.translation = this.selectedItem.reportHeaderLine2
        param3.languageCode = this.languageList[1].languageCode
        param3.columnKey = "PARAM_VALUE"
        param3.language.languageId = this.languageList[1].languageId
        param3.language.languageCode = this.languageList[1].languageCode
        param3.language.languageName = this.languageList[1].languageName
        param3.language.countryCode = this.languageList[1].countryCode
        translationList2.push(param3)

        // ReportHeaderLine2 Second-Lang
        let param4: Translation = new Translation()
        param4.translationsId = this.reportHeaderLine2Params.translations[1].translationId
        param4.textContentId = this.reportHeaderLine2Params.translations[1].textContentId

        param4.translation = this.secondLanguageHeaderLine2
        param4.languageCode = this.languageList[langId].languageCode
        param4.columnKey = "PARAM_VALUE"
        param4.language.languageId = this.languageList[langId].languageId
        param4.language.languageCode = this.languageList[langId].languageCode
        param4.language.languageName = this.languageList[langId].languageName
        param4.language.countryCode = this.languageList[langId].countryCode
        translationList2.push(param4)

        // ReportHeaderLine3 First-Lang
        let param5: Translation = new Translation()
        param5.translationsId = this.reportHeaderLine3Params.translations[0].translationId
        param5.textContentId = this.reportHeaderLine3Params.translations[0].textContentId

        param5.translation = this.selectedItem.reportHeaderLine3
        param5.languageCode = this.languageList[1].languageCode
        param5.columnKey = "PARAM_VALUE"
        param5.language.languageId = this.languageList[1].languageId
        param5.language.languageCode = this.languageList[1].languageCode
        param5.language.languageName = this.languageList[1].languageName
        param5.language.countryCode = this.languageList[1].countryCode
        translationList3.push(param5)

        // ReportHeaderLine3 Second-Lang
        let param6: Translation = new Translation()
        param6.translationsId = this.reportHeaderLine3Params.translations[1].translationId
        param6.textContentId = this.reportHeaderLine3Params.translations[1].textContentId

        param6.translation = this.secondLanguageHeaderLine3
        param6.languageCode = this.languageList[langId].languageCode
        param6.columnKey = "PARAM_VALUE"
        param6.language.languageId = this.languageList[langId].languageId
        param6.language.languageCode = this.languageList[langId].languageCode
        param6.language.languageName = this.languageList[langId].languageName
        param6.language.countryCode = this.languageList[langId].countryCode
        translationList3.push(param6)

        // ReportFooterLine1 First-Lang
        let param7: Translation = new Translation()
        param7.translationsId = this.reportFooterLine1Params.translations[0].translationId
        param7.textContentId = this.reportFooterLine1Params.translations[0].textContentId

        param7.translation = this.selectedItem.reportFooter1
        param7.languageCode = this.languageList[1].languageCode
        param7.columnKey = "PARAM_VALUE"
        param7.language.languageId = this.languageList[1].languageId
        param7.language.languageCode = this.languageList[1].languageCode
        param7.language.languageName = this.languageList[1].languageName
        param7.language.countryCode = this.languageList[1].countryCode
        translationList4.push(param7)

        // ReportFooterLine1 Second-Lang
        let param8: Translation = new Translation()
        param8.translationsId = this.reportFooterLine1Params.translations[1].translationId
        param8.textContentId = this.reportFooterLine1Params.translations[1].textContentId

        param8.translation = this.secondLanguageFooterLine1
        param8.languageCode = this.languageList[langIdFooter].languageCode
        param8.columnKey = "PARAM_VALUE"
        param8.language.languageId = this.languageList[langIdFooter].languageId
        param8.language.languageCode = this.languageList[langIdFooter].languageCode
        param8.language.languageName = this.languageList[langIdFooter].languageName
        param8.language.countryCode = this.languageList[langIdFooter].countryCode
        translationList4.push(param8)

        // ReportFooterLine2 First-Lang
        let param9: Translation = new Translation()
        param9.translationsId = this.reportFooterLine2Params.translations[0].translationId
        param9.textContentId = this.reportFooterLine2Params.translations[0].textContentId

        param9.translation = this.selectedItem.reportFooter2
        param9.languageCode = this.languageList[1].languageCode
        param9.columnKey = "PARAM_VALUE"
        param9.language.languageId = this.languageList[1].languageId
        param9.language.languageCode = this.languageList[1].languageCode
        param9.language.languageName = this.languageList[1].languageName
        param9.language.countryCode = this.languageList[1].countryCode
        translationList5.push(param9)

        // ReportFooterLine2 Second-Lang
        let param10: Translation = new Translation()
        param10.translationsId = this.reportFooterLine2Params.translations[1].translationId
        param10.textContentId = this.reportFooterLine2Params.translations[1].textContentId

        param10.translation = this.secondLanguageFooterLine2
        param10.languageCode = this.languageList[langIdFooter].languageCode
        param10.columnKey = "PARAM_VALUE"
        param10.language.languageId = this.languageList[langIdFooter].languageId
        param10.language.languageCode = this.languageList[langIdFooter].languageCode
        param10.language.languageName = this.languageList[langIdFooter].languageName
        param10.language.countryCode = this.languageList[langIdFooter].countryCode
        translationList5.push(param10)

        // .....................................................................

        // let participantParams: any[] = [];
        // this.selectedItem.passwordStrength = jQuery('#pwdStrength').slider('getValue');
        // this.selectedItem.passwordStrengthString = this.selectedItem.passwordStrength === 1 ? 'L' : this.selectedItem.passwordStrength === 2 ? 'M' : 'H';
        // this.selectedItem.passwordHistoryDays = jQuery('#pwdHistory').slider('getValue');
        // this.selectedItem.passwordExpiryDays = jQuery('#pwdExpiry').slider('getValue');
        // this.selectedItem.advanceAlertPasswordExpiryDays = jQuery('#advanceAlertPwdExpiry').slider('getValue');
        // this.selectedItem.unsuccessfulLoginAttempts = jQuery('#unsuccessfulLogins').slider('getValue');
        participantParams.push(
            {
                'paramId': 1,
                'paramValue': this.selectedItem.reportHeaderLine1,
                'paramName': this.reportHeaderline1,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant)),
                'translations': JSON.parse(JSON.stringify(translationList1))
            }
        )
        participantParams.push(
            {
                'paramId': 2,
                'paramValue': this.selectedItem.reportHeaderLine2,
                'paramName': this.reportHeaderline2,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant)),
                'translations': JSON.parse(JSON.stringify(translationList2))
            }
        )
        participantParams.push(
            {
                'paramId': 3,
                'paramValue': this.selectedItem.reportHeaderLine3,
                'paramName': this.reportHeaderline3,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant)),
                'translations': JSON.parse(JSON.stringify(translationList3))
            }
        )
        participantParams.push(
            {
                'paramId': 4,
                'paramValue': this.selectedItem.reportFooter1,
                'paramName': this.reportFooter1,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant)),
                'translations': JSON.parse(JSON.stringify(translationList4))
            }
        )
        participantParams.push(
            {
                'paramId': 5,
                'paramValue': this.selectedItem.reportFooter2,
                'paramName': this.reportFooter2,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant)),
                'translations': JSON.parse(JSON.stringify(translationList5))
            }
        )

        // participantParams.push(
        //     {
        //         'paramId': 6,
        //         'paramValue': this.selectedItem.debitCreditDisplayMode ? 'A' : 'B',
        //         'paramName': this.debitCreditDisplayMode,
        //         'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
        //     }
        // )
        participantParams.push(
            {
                'paramId': 7,
                'paramValue': this.selectedItem.smtpServer,
                'paramName': this.SMTPServer,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )
        participantParams.push(
            {
                'paramId': 8,
                'paramValue': this.selectedItem.smtpOutgoingEmail,
                'paramName': this.SMTPOutgoingEmail,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )
        participantParams.push(
            {
                'paramId': 9,
                'paramValue': this.originalPassword,    //  this.selectedItem.password,
                'paramName': this._password,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 12,
                'paramValue': this.selectedItem.smtpPort,
                'paramName': this.SMTPPort,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 10,
                'paramValue': this.selectedItem.defaultSecutrityHairCut,
                'paramName': this.defaultSeurtiyHaircut,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 14,
                'paramValue': this.selectedItem.passwordStrengthString,
                'paramName': this.passwordStrength,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 15,
                'paramValue': this.selectedItem.passwordHistoryDays,
                'paramName': this.passwordHistoryDays,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 16,
                'paramValue': this.selectedItem.passwordExpiryDays,
                'paramName': this.PasswordExpiryDays,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 17,
                'paramValue': this.selectedItem.advanceAlertPasswordExpiryDays,
                'paramName': this.advanceAlertPasswordExpiryDays,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 18,
                'paramValue': this.selectedItem.unsuccessfulLoginAttempts,
                'paramName': this.UnsuccessfulLoginAttempts,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 20,
                'paramValue': this.selectedItem.cgt365DaysTaxPercentage,
                'paramName': this.cgt365DaysTaxPercentage,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))

            }
        )

        participantParams.push(
            {
                'paramId': 22,
                'paramValue': this.selectedItem.individualCgtExpensePercentage,
                'paramName': this.individualCgtExpensePercentage,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 21,
                'paramValue': this.selectedItem.cgtAbove365DaysTaxPercentage,
                'paramName': this.cgtAbove365DaysTaxPercentage,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        participantParams.push(
            {
                'paramId': 23,
                'paramValue': this.selectedItem.corporateCgtExpensePercentage,
                'paramName': this.corporateCgtExpensePercentage,
                'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
            }
        )

        return participantParams;

    }

    public getHeadLevelDetail(): any {
        let headLevelDetils: any[] = [];

        for (let i: number = 0; i < this.selectedItem.chartOfAccountLevelCodeLength.length; i++) {
            headLevelDetils.push(
                {
                    'headLevelDetailId': null,
                    'codeLength': this.selectedItem.chartOfAccountLevelCodeLength[i].length,
                    'headLevel': this.selectedItem.chartOfAccountLevelCodeLength[i].level,
                    'participant': JSON.parse(JSON.stringify(this.selectedItem.participant))
                }
            )
        }
        return headLevelDetils;
    }
    public toJson(): any {
        debugger
        let temp: any = {
            'glParms': {
                'glParamId': this.glParamId,
                'backdateEntry': this.selectedItem.voucherBackDateEntry,
                'coaLevels': this.selectedItem.chartOfAccountLevelCodeLength.length,
                'vouNoReinitialize': this.selectedItem.voucherNoResetPolicyMonthYear ? 'M' : 'Y',
                'participant': this.selectedItem.participant,
                'clientControlAccount': {
                    'chartOfAccountId': this.selectedItem.clientControlAccount.chartOfAccountId
                },
                'roundingAccount': {
                    'chartOfAccountId': this.selectedItem.roundingDifferenceAccount.chartOfAccountId
                },
                'unappropriatePlAccount': {
                    'chartOfAccountId': this.selectedItem.unappropriatePLaccount.chartOfAccountId
                },
                'capitalGainAccount': {
                    'chartOfAccountId': this.selectedItem.capitalGainAccount.chartOfAccountId
                },
                'voucherType': {
                    'voucherTypeId': this.selectedItem.voucherType_Misc.voucherTypeId
                }
            },
            'companyLogoBase64_': (this.file_srcs[0]),
            'companyLogoContentType': AppUtility.isEmpty(this.fileContentType_) ? this.selectedItem.companyLogoContentType : this.fileContentType_,
            'companyLogoName': AppUtility.isEmpty(this.fileName_) ? this.selectedItem.companyLogoName : this.fileName_,
            'participantId': AppConstants.participantId,
            'headLevelDetils': this.getHeadLevelDetail(),
            'participantParams': this.getParticipantParams(),
            'settlements': this.getSettlementsList()
        }

        console.log(JSON.stringify(temp));
        return temp;
    }

    private getSettlementsList() {
        if (AppUtility.isValidVariable(this.settlementDetailList) && !AppUtility.isEmptyArray(this.settlementDetailList.items)) {
            let temp: any[] = [];
            for (let i: number = 0; i < this.settlementDetailList.items.length; i++) {
                temp.push(JSON.parse(JSON.stringify(this.settlementDetailList.items[i])));
            }
            return temp;
        }
        else return null;
    }

    public populateApplicationSetup() {
        this.clearFields();
        this.loader.show();
        this.listingService.getApplicationSetup(AppConstants.participantId)
            .subscribe(
                restData => {
                    debugger
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    } else {
                        if (!AppUtility.isEmpty(restData))
                            this.fillApplicationSetupFromJson(this.selectedItem, restData);
                        // console.log('RestData>>><br/>' + JSON.stringify(restData));
                    }
                },
                error => {
                    this.loader.hide();
                    if(error.message){
                        this.errorMessage = <any>error.message;
                      }
                      else
                      {
                        this.errorMessage = <any>error;
                      }
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');
                });
    }

    fillApplicationSetupFromJson(as: ApplicationSetup, data: any) {
        if (!AppUtility.isEmpty(data)) {
            if (data.glParms.coaLevels == 0)
                this.chartofAccountNumbers = 1;
            else
                this.chartofAccountNumbers = data.glParms.coaLevels;

            this.glParamId = data.glParms.glParamId;
            this.selectedItem.chartOfAccountLevelCodeLength = [];
            let temp: any[] = [];
            temp.push({ 'level': 1, 'length': 2 });

            for (let i: number = 1; i < data.headLevelDetils.length; i++) {
                temp.push(
                    {
                        'headLevelDetailId': data.headLevelDetils[i].headLevelDetailId,
                        'level': data.headLevelDetils[i].headLevel,
                        'length': data.headLevelDetils[i].codeLength,
                    }
                )
                this.dataPopulated = true;
            }

            this.selectedItem.chartOfAccountLevelCodeLength = temp;
            this.onVoucherBackDateEntryChangeEvent(data.glParms.backdateEntry);
            if (data.glParms.coaLevels == 0)
                this.selectedItem.chartOfAccountLevel = 1;
            else
                this.selectedItem.chartOfAccountLevel = data.glParms.coaLevels;

            this.onVoucherNoResetPolicyMonthYearChangeEvent(data.glParms.vouNoReinitialize == 'M');
            this.selectedItem.companyLogoBase64_ = data.companyLogoBase64_;
            this.selectedItem.companyLogoContentType = data.companyLogoContentType;
            this.selectedItem.companyLogoName = data.companyLogoName;

            if (!AppUtility.isEmpty(data.companyLogoBase64_)) {
                this.file_srcs.push(this.selectedItem.companyLogoBase64_.valueOf());
            }
            // this.selectedItem.reportHeaderLine1 = data.participantParams[0].paramValue;
            // this.selectedItem.reportHeaderLine2 = data.participantParams[1].paramValue;
            // this.selectedItem.reportHeaderLine3 = data.participantParams[2].paramValue;
            // this.selectedItem.reportFooter1 = data.participantParams[3].paramValue;
            // this.selectedItem.reportFooter2 = data.participantParams[4].paramValue;
            // this.selectedItem.smtpServer = data.participantParams[6].paramValue;
            // this.selectedItem.smtpOutgoingEmail = data.participantParams[7].paramValue;
            // this.selectedItem.password = data.participantParams[8].paramValue;
            // this.selectedItem.defaultSecutrityHairCut = parseInt(data.participantParams[9].paramValue);
            for (let i: number = 0; i < data.participantParams.length; i++) {
                switch (data.participantParams[i].paramId) {
                    case 1:
                        this.selectedItem.reportHeaderLine1 = data.participantParams[i].translations[0].translation;
                        this.secondLanguageHeaderLine1 = data.participantParams[i].translations[1].translation;

                        this.reportHeaderLine1Params.participantParamId = i
                        this.reportHeaderLine1Params.translations[0].translationId = data.participantParams[i].translations[0].translationsId;
                        this.reportHeaderLine1Params.translations[0].textContentId = data.participantParams[i].translations[0].textContentId;
                        this.reportHeaderLine1Params.translations[1].translationId = data.participantParams[i].translations[1].translationsId;
                        this.reportHeaderLine1Params.translations[1].textContentId = data.participantParams[i].translations[1].textContentId;

                        break;

                    case 2:
                        this.selectedItem.reportHeaderLine2 = data.participantParams[i].translations[0].translation;
                        this.secondLanguageHeaderLine2 = data.participantParams[i].translations[1].translation;

                        this.reportHeaderLine2Params.participantParamId = i
                        this.reportHeaderLine2Params.translations[0].translationId = data.participantParams[i].translations[0].translationsId;
                        this.reportHeaderLine2Params.translations[0].textContentId = data.participantParams[i].translations[0].textContentId;
                        this.reportHeaderLine2Params.translations[1].translationId = data.participantParams[i].translations[1].translationsId;
                        this.reportHeaderLine2Params.translations[1].textContentId = data.participantParams[i].translations[1].textContentId;
                        break;

                    case 3:
                        this.selectedItem.reportHeaderLine3 = data.participantParams[i].translations[0].translation;
                        this.secondLanguageHeaderLine3 = data.participantParams[i].translations[1].translation;

                        this.reportHeaderLine3Params.participantParamId = i
                        this.reportHeaderLine3Params.translations[0].translationId = data.participantParams[i].translations[0].translationsId;
                        this.reportHeaderLine3Params.translations[0].textContentId = data.participantParams[i].translations[0].textContentId;
                        this.reportHeaderLine3Params.translations[1].translationId = data.participantParams[i].translations[1].translationsId;
                        this.reportHeaderLine3Params.translations[1].textContentId = data.participantParams[i].translations[1].textContentId;
                        break;

                    case 4:
                        this.selectedItem.reportFooter1 = data.participantParams[i].translations[0].translation;
                        this.secondLanguageFooterLine1 = data.participantParams[i].translations[1].translation;

                        this.reportFooterLine1Params.participantParamId = i
                        this.reportFooterLine1Params.translations[0].translationId = data.participantParams[i].translations[0].translationsId;
                        this.reportFooterLine1Params.translations[0].textContentId = data.participantParams[i].translations[0].textContentId;
                        this.reportFooterLine1Params.translations[1].translationId = data.participantParams[i].translations[1].translationsId;
                        this.reportFooterLine1Params.translations[1].textContentId = data.participantParams[i].translations[1].textContentId;
                        break;

                    case 5:
                        this.selectedItem.reportFooter2 = data.participantParams[i].translations[0].translation;
                        this.secondLanguageFooterLine2 = data.participantParams[i].translations[1].translation;

                        this.reportFooterLine2Params.participantParamId = i
                        this.reportFooterLine2Params.translations[0].translationId = data.participantParams[i].translations[0].translationsId;
                        this.reportFooterLine2Params.translations[0].textContentId = data.participantParams[i].translations[0].textContentId;
                        this.reportFooterLine2Params.translations[1].translationId = data.participantParams[i].translations[1].translationsId;
                        this.reportFooterLine2Params.translations[1].textContentId = data.participantParams[i].translations[1].textContentId;
                        break;

                    // case 6:
                    //     this.selectedItem.debitCreditDisplayMode = data.participantParams[i].paramValue == 'A'
                    //     break;

                    case 7:
                        this.selectedItem.smtpServer = data.participantParams[i].paramValue;
                        break;

                    case 12:
                        this.selectedItem.smtpPort = data.participantParams[i].paramValue;
                        break;

                    case 8:
                        this.selectedItem.smtpOutgoingEmail = data.participantParams[i].paramValue;
                        break;

                    case 9:
                        this.originalPassword = this.selectedItem.password = data.participantParams[i].paramValue;
                        break;

                    case 10:
                        this.selectedItem.defaultSecutrityHairCut = parseFloat(data.participantParams[i].paramValue);
                        break;

                    case 11:
                        break;



                    case 14:
                        this.selectedItem.passwordStrength = data.participantParams[i].paramValue === 'L' ? 1 :
                            data.participantParams[i].paramValue === 'M' ? 2 : 3;
                        jQuery('#pwdStrengthVal').text(data.participantParams[i].paramValue === 'L' ? 'Low' : data.participantParams[i].paramValue === 'M' ? 'Medium' : 'High');
                        break;

                    case 15:
                        this.selectedItem.passwordHistoryDays = parseInt(data.participantParams[i].paramValue);
                        jQuery('#pwdHistoryVal').text(data.participantParams[i].paramValue);
                        break;

                    case 16:

                        this.selectedItem.passwordExpiryDays = parseInt(data.participantParams[i].paramValue);
                        jQuery('#pwdExpiryVal').text(data.participantParams[i].paramValue);
                        break;

                    case 17:
                        this.selectedItem.advanceAlertPasswordExpiryDays = parseInt(data.participantParams[i].paramValue);
                        jQuery('#advanceAlertPwdExpiryVal').text(data.participantParams[i].paramValue);
                        break;

                    case 18:
                        this.selectedItem.unsuccessfulLoginAttempts = parseInt(data.participantParams[i].paramValue);
                        jQuery('#unsuccessfulLoginsVal').text(data.participantParams[i].paramValue);
                        break;

                    case 20:
                        this.selectedItem.cgt365DaysTaxPercentage = parseFloat(data.participantParams[i].paramValue);
                        break;

                    case 22:
                        this.selectedItem.individualCgtExpensePercentage = parseFloat(data.participantParams[i].paramValue);
                        break;

                    case 21:
                        this.selectedItem.cgtAbove365DaysTaxPercentage = parseFloat(data.participantParams[i].paramValue);
                        break;

                    case 23:
                        this.selectedItem.corporateCgtExpensePercentage = parseFloat(data.participantParams[i].paramValue);
                        break;

                    default:
                        break;
                }
            }

            // jQuery('#pwdStrength').slider('setValue', this.selectedItem.passwordStrength);
            // jQuery('#pwdHistory').slider('setValue', this.selectedItem.passwordHistoryDays);
            // jQuery('#pwdExpiry').slider('setValue', this.selectedItem.passwordExpiryDays);
            // jQuery('#advanceAlertPwdExpiry').slider('setValue', this.selectedItem.advanceAlertPasswordExpiryDays);
            // jQuery('#unsuccessfulLogins').slider('setValue', this.selectedItem.unsuccessfulLoginAttempts);

            this.password_Strength = this.selectedItem.passwordStrength
            this.password_Expiry = this.selectedItem.passwordExpiryDays
            this.password_History = this.selectedItem.passwordHistoryDays
            this.password_ExpiryAlerts = this.selectedItem.advanceAlertPasswordExpiryDays
            this.Unsuccessfull_LoginAttempts = this.selectedItem.unsuccessfulLoginAttempts

            debugger
            this.selectedItem.participant.participantId = AppConstants.participantId;
            this.selectedItem.clientControlAccount.chartOfAccountId = data.glParms.clientControlAccount.chartOfAccountId;
            this.selectedItem.clientControlAccount.glCodeDisplayName_ = data.glParms.clientControlAccount.glCodeDisplayName_;

            this.selectedItem.roundingDifferenceAccount.chartOfAccountId = data.glParms.roundingAccount.chartOfAccountId;
            this.selectedItem.roundingDifferenceAccount.glCodeDisplayName_ = data.glParms.roundingAccount.glCodeDisplayName_;

            this.selectedItem.unappropriatePLaccount.chartOfAccountId = data.glParms.unappropriatePlAccount.chartOfAccountId;
            this.selectedItem.unappropriatePLaccount.glCodeDisplayName_ = data.glParms.unappropriatePlAccount.glCodeDisplayName_;

            this.clientControlAccountId = data.glParms.clientControlAccount.chartOfAccountId;
            this.unappropriatePLaccountId = data.glParms.unappropriatePlAccount.chartOfAccountId;
            this.roundingDifferenceAccountId = data.glParms.roundingAccount.chartOfAccountId;
            this.capitalGainAccountId = data.glParms.capitalGainAccount.chartOfAccountId;
            this.voucherTypeId_Misc = data.glParms.voucherType.voucherTypeId;

            if (this.selectedItem.receivables.glAccount.chartOfAccountId != null) {
                this.dataPopulated = false;
            }
            // this.selectedItem.receivables.voucherType.voucherTypeId = data.receivables.voucherType.voucherTypeId;
            // this.selectedItem.receivables.voucherType.displayName_ = data.receivables.voucherType.displayName_
            // this.selectedItem.receivables.glAccount.chartOfAccountId = data.receivables.chartOfAccount.chartOfAccountId;
            // this.selectedItem.receivables.glAccount.glCodeDisplayName_ = data.receivables.chartOfAccount.glCodeDisplayName_;
            // this.selectedItem.receivables.voucherDescription = data.receivables.voucherNaration;
            // this.selectedItem.receivables.participantParamId = data.receivables.paramId;

            // this.selectedItem.exchange.exchangeId = data.receivables.exchange.exchangeId;
            // this.selectedItem.exchange.exchangeCode = data.receivables.exchange.exchangeCode;
        }
    }
    public onSaveAction(model: any, isValid: boolean) {
        if (!this.editDetailEquity) {
            if (!this.deleteDetailEquity) {
                this.loader.show();
                if (!this.compulsoryError && !this.defaultSecurityHaircut) {

                    console.log(this.toJson())

                    this.listingService.saveApplicationSetup(this.toJson()).subscribe(
                        data => {

                            this.loader.hide();
                            if (AppUtility.isEmpty(this.selectedItem.chartOfAccountLevelCodeLength))
                                this.selectedItem.chartOfAccountLevelCodeLength = [];
                            this.fillApplicationSetupFromJson(this.selectedItem, data);
                            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;

                            this.dialogCmp.showAlartDialog('Success');
                            this.compulsoryError = false;
                            this.populateReceivableCommissionPayables();
                        },
                        error => {
                            debugger
                            this.loader.hide();
                            if(error.message){
                                this.errorMessage = <any>error.message;
                              }
                              else
                              {
                                this.errorMessage = <any>error;
                              }
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                        }
                    );
                }
                else { this.loader.hide(); }
            }
            else { this.loader.show(); }
            this.deleteDetailEquity = false;
        }
    }

    public setCompulsoryValidators() {
        (<any>this.myForm).controls.reportHeaderLine1.setValidators([Validators.required]);
        (<any>this.myForm).controls.reportHeaderLine1.updateValueAndValidity();

        (<any>this.myForm).controls.reportHeaderLine2.setValidators([Validators.required]);
        (<any>this.myForm).controls.reportHeaderLine2.updateValueAndValidity();

        (<any>this.myForm).controls.reportHeaderLine3.setValidators([Validators.required]);
        (<any>this.myForm).controls.reportHeaderLine3.updateValueAndValidity();

        (<any>this.myForm).controls.smtpServer.setValidators([Validators.required, Validators.pattern(AppConstants.validate_IPv6_IPv4_Hostname)]);
        (<any>this.myForm).controls.smtpServer.updateValueAndValidity();

        (<any>this.myForm).controls.smtpPort.setValidators([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)]);
        (<any>this.myForm).controls.smtpPort.updateValueAndValidity();

        (<any>this.myForm).controls.password.setValidators([Validators.required]);
        (<any>this.myForm).controls.password.updateValueAndValidity();

        (<any>this.myForm).controls.smtpEmail.setValidators([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)]);
        (<any>this.myForm).controls.smtpEmail.updateValueAndValidity();

        (<any>this.myForm).controls.reportFooter1.setValidators([Validators.required]);
        (<any>this.myForm).controls.reportFooter1.updateValueAndValidity();

        (<any>this.myForm).controls.reportFooter2.setValidators([Validators.required]);
        (<any>this.myForm).controls.reportFooter2.updateValueAndValidity();

        (<any>this.myForm).controls.chartOfAccountLevel.setValidators(null);
        (<any>this.myForm).controls.chartOfAccountLevel.updateValueAndValidity();
    }
    public FinalSave() {
        this.setCompulsoryValidators();
        this.compulsoryError = false;
        this.alertMessage = '';
        this.checkCompulsory();
    }

    public checkCompulsory() {
        this.markDirtyCompulsory();
        this.alertMessage = '';
        this.checkFinancialsTab();
        this.checkStaionaryTab();
        this.checkEmailTab();
        this.checkContractNote();
        this.checkMiscellaneousTab();
    }

    public checkMiscellaneousTab() {
        if (this.selectedItem.capitalGainAccount.chartOfAccountId != null && this.selectedItem.voucherType_Misc.voucherTypeId === null) {
            this.alertMessage = this.alertMessage.concat('Both Capital Gain Account and Voucher Type are mandatory, if you select either on \'<b>Miscellaneous Tab</b>\'<br/>');
            this.compulsoryError = true;
        }
        if (this.selectedItem.voucherType_Misc.voucherTypeId != null && this.selectedItem.capitalGainAccount.chartOfAccountId === null) {
            this.alertMessage = this.alertMessage.concat('Both Capital Gain Account and Voucher Type are mandatory, if you select either on \'<b>Miscellaneous Tab</b>\'<br/>');
            this.compulsoryError = true;
        }
    }
    public checkContractNote() {
        let errorArray: string[] = [];
        if (!(<any>this.myForm).controls.reportFooter1.valid) errorArray.push('Report Footer 1');
        if (!(<any>this.myForm).controls.reportFooter2.valid) errorArray.push('Report Footer 2');
        if (errorArray.length > 0) {
            this.alertMessage = this.alertMessage.concat('Please enter ' + errorArray.join(", ") + ' on \'<b>Contract Note Tab</b>\'<br/>');
            this.compulsoryError = true;
        }
    }

    public checkEquityTab(): boolean {
        return (<any>this.myForm).controls.exchangeName.valid &&
            (<any>this.myForm).controls.voucherTypeIdR.valid &&
            (<any>this.myForm).controls.chartOfAccountIdR.valid &&
            (<any>this.myForm).controls.vouNarationR.valid &&
            (<any>this.myForm).controls.settlement.valid &&
            (<any>this.myForm).controls.settlementType.valid;
    }

    public checkStaionaryTab() {

        let errorArray: string[] = [];
        if (!(<any>this.myForm).controls.reportHeaderLine1.valid) errorArray.push('Report Header Line 1');
        if (!(<any>this.myForm).controls.reportHeaderLine2.valid) errorArray.push('Report Header Line 2');
        if (!(<any>this.myForm).controls.reportHeaderLine3.valid) errorArray.push('Report Header Line 3');
        if (this.file_srcs.length == 0 || this.fileSizeExceed) errorArray.push('Company Logo');
        if (errorArray.length > 0) {
            this.alertMessage = this.alertMessage.concat('Please enter ' + errorArray.join(", ") + ' on \'<b>Stationery Tab</b>\'<br/>');
            this.compulsoryError = true;
        }
    }
    private populateReceivables(index: number) {
        this.selectedItem.receivables = new ParticipantSettlementParams();
        this.selectedItem.receivables.voucherType = new VoucherType();

        this.selectedItem.receivables.voucherType.voucherType = this.receivableCommissionPayablesList[index].voucherType.voucherType;
        this.selectedItem.receivables.voucherType.voucherTypeId = this.receivableCommissionPayablesList[index].voucherType.voucherTypeId;

        this.selectedItem.receivables.glAccount = new ChartOfAccount();

        this.selectedItem.receivables.glAccount.glCodeDisplayName_ = this.receivableCommissionPayablesList[index].chartOfAccount.glCodeDisplayName_;
        this.selectedItem.receivables.glAccount.chartOfAccountId = this.receivableCommissionPayablesList[index].chartOfAccount.chartOfAccountId;

        this.selectedItem.receivables.voucherDescription = this.receivableCommissionPayablesList[index].voucherNaration;
        this.selectedItem.receivables.participantParamId = this.receivableCommissionPayablesList[index].paramId;
    }

    public onExchangeChange(exch) {
        this.selectedItem.exchange.exchangeId = exch;
        // if (exch != null) {
        //     this.populateReceivableCommissionPayables(exch);

        //     if (this.receivableCommissionPayablesList.length != 0) {
        //         for (let i: number = 0; i < this.receivableCommissionPayablesList.length; i++) {
        //             if (this.receivableCommissionPayablesList[i].paramCode == 'R')
        //                 this.populateReceivables(i);
        //             // else if (this.receivableCommissionPayablesList[i].paramCode == 'P')
        //             //     this.populatePayables(i);
        //             // else if (this.receivableCommissionPayablesList[i].paramCode == 'C')
        //             //     this.populateCommission(i);
        //         }
        //     }
        // }
    }

    public checkFinancialsTab() {
        let errorArray: string[] = [];
        let status: boolean = true;
        for (let i: number = 0; i < this.selectedItem.chartOfAccountLevelCodeLength.length; i++) {
            if (this.selectedItem.chartOfAccountLevelCodeLength[i].length == '' ||
                this.selectedItem.chartOfAccountLevelCodeLength[i].length < 1 ||
                this.selectedItem.chartOfAccountLevelCodeLength[i].length > 100)
                status = false;
        }
        if (!status) errorArray.push('Chart of Account Length');
        if (this.chartOfAccountLevelError) errorArray.push('Chart of Account Level');
        if (errorArray.length > 0) {
            this.alertMessage = this.alertMessage.concat('Please enter ' + errorArray.join(", ") + ' on \'<b>Financials Tab</b>\'<br/>');
            this.compulsoryError = true;
        }
    }

    public checkEmailTab() {
        let errorArray: string[] = [];
        if (!(<any>this.myForm).controls.smtpServer.valid) errorArray.push('SMTP Server');
        if (!(<any>this.myForm).controls.smtpPort.valid) errorArray.push('SMTP Server Port');
        if (!(<any>this.myForm).controls.password.valid) errorArray.push('Password');
        if (!(<any>this.myForm).controls.smtpEmail.valid) errorArray.push('SMTP Outgoing Email');
        if (errorArray.length > 0) {
            this.alertMessage = this.alertMessage.concat('Please enter ' + errorArray.join(", ") + ' on \'<b>Email Tab</b>\'<br/>');
            this.compulsoryError = true;
        }
    }

    public markDirtyCompulsory() {
        this.markDirtyStationeryTabControls();
        this.markDirtyEmailTabControls();
        this.markDirtyContractNoteTabControls();
    }
    private populateExchangeList() {
        this.loader.show();
        this.listingService.getParticipantExchangeList(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.exchangeNameList = restData;
                    let cs: Exchange = new Exchange();
                    cs.exchangeId = AppConstants.PLEASE_SELECT_VAL;
                    cs.exchangeCode = AppConstants.PLEASE_SELECT_STR;
                    this.exchangeNameList.unshift(cs);
                },
                error => {
                    this.loader.hide();
                    if(error.message){
                        this.errorMessage = <any>error.message;
                      }
                      else
                      {
                        this.errorMessage = <any>error;
                      }
                });
    }

    private populateReceivableCommissionPayables() {
        this.loader.show();
        this.listingService.getReceivableCommissionPayables(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (!AppUtility.isEmpty(restData)) {
                        this.settlementDetailList = new wjcCore.CollectionView(restData);
                        this.AllowingEdit();
                    }
                    else {
                        this.loader.hide();
                        this.settlementDetailList = new wjcCore.CollectionView();
                    }
                },
                error => {
                    if(error.message){
                        this.errorMessage = <any>error.message;
                      }
                      else
                      {
                        this.errorMessage = <any>error;
                      }
                });
    }

    private populateSettlementTypeList() {
        this.loader.show();
        this.listingService.getActiveSettlementTypesList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.settlementTypeList = restData;
                    var sett: SettlementType = new SettlementType();
                    sett.settlementTypeId = AppConstants.PLEASE_SELECT_VAL;
                    sett.settlementType = AppConstants.PLEASE_SELECT_STR;
                    this.settlementTypeList.unshift(sett);
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private populateVoucherTypeList() {
        this.loader.show();
        this.listingService.getVoucherTypeList(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.voucherTypeList = restData;
                    this.voucherTypeList_Misc = restData;
                    var vt: VoucherType = new VoucherType();
                    vt.voucherTypeId = AppConstants.PLEASE_SELECT_VAL;
                    vt.displayName_ = AppConstants.PLEASE_SELECT_STR;
                    this.voucherTypeList.unshift(vt);
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private AllowingEdit() {
        if (AppUtility.isValidVariable(this.settlementDetailList)) {
            for (let i = 0; i < this.settlementDetailList.items.length; i++) {
                if (this.settlementDetailList.items[i].paramId == null) {
                    this.settlementDetailList.items[i].newElement = true;
                } else {
                    this.settlementDetailList.items[i].newElement = false;
                }
                this.settlementDetailList.refresh();
            }
        }
    }

    private populateChartOfAccountList() {
        this.loader.show();
        this.listingService.getChartOfAccountList(AppConstants.participantId, true)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        var vt: ChartOfAccount = new ChartOfAccount();
                        vt.chartOfAccountId = AppConstants.PLEASE_SELECT_VAL;
                        vt.glCodeDisplayName_ = AppConstants.PLEASE_SELECT_STR;
                        this.chartOfAccountList = [vt];
                    } else {
                        this.chartOfAccountList = restData;
                        var vt: ChartOfAccount = new ChartOfAccount();
                        vt.chartOfAccountId = AppConstants.PLEASE_SELECT_VAL;
                        vt.glCodeDisplayName_ = AppConstants.PLEASE_SELECT_STR;
                        this.chartOfAccountList.unshift(vt);
                    }
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private populateSettlementList() {
        this.settlementList = [{
            'paramCode': AppConstants.PLEASE_SELECT_VAL,
            'paramName': AppConstants.PLEASE_SELECT_STR
        },
        {
            'paramCode': 'R',
            'paramName': 'Receivables'
        },
        {
            'paramCode': 'P',
            'paramName': 'Payables'
        },
        {
            'paramCode': 'C',
            'paramName': 'Commission'
        }];
    }

    private populateLanguageList() {
        this.languageList = [{
            'languageId': AppConstants.PLEASE_SELECT_VAL,
            'languageCode': AppConstants.PLEASE_SELECT_STR,
            'languageName': AppConstants.PLEASE_SELECT_STR,
            'countryCode': ''
        },
        {
            'languageId': 1,
            'languageCode': 'en',
            'languageName': 'English',
            'countryCode': 'US'
        },
        {
            'languageId': 2,
            'languageCode': 'pt',
            'languageName': 'Portuguese',
            'countryCode': 'PT'
        }]
    }

    private populateUnappropriatePLAccountList() {
        this.loader.show();
        this.listingService.getChartOfAccountList(AppConstants.participantId, true)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        var vt: ChartOfAccount = new ChartOfAccount();
                        vt.chartOfAccountId = AppConstants.PLEASE_SELECT_VAL;
                        vt.glCodeDisplayName_ = AppConstants.PLEASE_SELECT_STR;
                        this.unappropriatePLAccountList = [vt];
                        // this.roundingDifferenceAccountList = [vt];
                        // this.capitalGainAccountList = [vt];
                    } else {
                        this.unappropriatePLAccountList = restData;
                        this.roundingDifferenceAccountList = restData;
                        this.capitalGainAccountList = restData;
                        var vt: ChartOfAccount = new ChartOfAccount();
                        vt.chartOfAccountId = AppConstants.PLEASE_SELECT_VAL;
                        vt.glCodeDisplayName_ = AppConstants.PLEASE_SELECT_STR;
                        this.unappropriatePLAccountList.unshift(vt);
                        // this.roundingDifferenceAccountList.unshift(vt);
                        // this.capitalGainAccountList.unshift(vt);
                    }
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private populateClientControlAccountList() {
        this.loader.show();
        this.listingService.getclientControlAccountList(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        var vt: ChartOfAccount = new ChartOfAccount();
                        vt.chartOfAccountId = AppConstants.PLEASE_SELECT_VAL;
                        vt.glCodeDisplayName_ = AppConstants.PLEASE_SELECT_STR;
                        this.clientControlAccountList = [vt];
                    }
                    else {
                        this.clientControlAccountList = restData;
                        debugger
                        var vt: ChartOfAccount = new ChartOfAccount();
                        vt.chartOfAccountId = AppConstants.PLEASE_SELECT_VAL;
                        vt.glCodeDisplayName_ = AppConstants.PLEASE_SELECT_STR;
                        this.clientControlAccountList.unshift(vt);
                        // this.selectedItem.clientControlAccount.chartOfAccountId = this.clientControlAccountList[0].chartOfAccountId 
                    }
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private getFinacialsDisabledFlag() {
        this.loader.show();
        this.listingService.getFinacialsDisabledFlag(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (restData) {
                        this.financialsTabDisabled = true;
                    }
                    else {
                        this.financialsTabDisabled = false;
                    }
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            chartOfAccountLevel: [''],
            exchangeName: ['', Validators.compose([Validators.required])],
            voucherTypeIdR: ['', Validators.compose([Validators.required])],
            chartOfAccountIdR: ['', Validators.compose([Validators.required])],
            vouNarationR: ['', Validators.compose([Validators.required])],

            reportHeaderLine1: ['', Validators.compose([Validators.required])],
            reportHeaderLine2: ['', Validators.compose([Validators.required])],
            reportHeaderLine3: ['', Validators.compose([Validators.required])],

            secondLanguageReportHeaderLine1: ['', Validators.compose([Validators.required])],
            secondLanguageReportHeaderLine2: ['', Validators.compose([Validators.required])],
            secondLanguageReportHeaderLine3: ['', Validators.compose([Validators.required])],

            fileUpload: [''],

            smtpServer: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validate_IPv6_IPv4_Hostname)])],
            smtpPort: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
            password: ['', Validators.compose([Validators.required])],
            smtpEmail: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],

            settlement: ['', Validators.compose([Validators.required])],
            settlementType: ['', Validators.compose([Validators.required])],
            unappropriatePLAccount: [''],
            clientControlAccount: [''],
            roundingDifferenceAccount: [''],
            defaultSecurityHaircut: [''],
            capitalGainAccount: [''],
            voucherType_Misc: ['', Validators.compose([Validators.required])],

            reportFooter1: [''],
            reportFooter2: [''],

            secondLanguagereportFooter1: [''],
            secondLanguagereportFooter2: [''],

            cgt365DaysTaxPercentage: [''],
            individualCgtExpensePercentage: [''],
            cgtAbove365DaysTaxPercentage: [''],
            corporateCgtExpensePercentage: [''],
            language1: ['', Validators.compose([Validators.required])],
            language2: ['', Validators.compose([Validators.required])],
            reportFooterlanguage1: [''],
            reportFooterlanguage2: [''],

        });
    }

    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }

    onPasswordFocusOut() {
        if (this.selectedItem.password !== '' && this.selectedItem.password !== this.dummyPassword) {
            this.originalPassword = this.selectedItem.password;
            this.selectedItem.password = this.dummyPassword;
        }
    }
}