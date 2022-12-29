import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertMessage } from 'app/models/alert-message';
import { BestMarket } from 'app/models/best-market';
import { Order } from 'app/models/order';
import { OrderConfirmation } from 'app/models/order-confirmation';
import { SymbolStats } from 'app/models/symbol-stats';

import * as wjcInput from '@grapecity/wijmo.input';
declare var jQuery: any;
import { AppState } from 'app/app.service';
import { AuthService2 } from 'app/services/auth2.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { TranslateService } from '@ngx-translate/core';
import { ComboItem } from 'app/models/combo-item';

import { UserService } from 'app/core/user/user.service';
import { AppConstants, AppUtility, UserTypes } from 'app/app.utility';

import { Router } from '@angular/router';
import { WebSocketService } from 'app/services/socket/web-socket.service';

import { AuthService } from 'app/services-oms/auth-oms.service';
import { Notification } from 'app/layout/layouts/classy/notifications/notification';
import { Notifications } from 'app/layout/layouts/classy/notifications/notifications.component';
import { ShareOrderService } from '../../../order/order.service';
import { RepoOrderComponent } from '../repo-order';
import { Repo } from 'app/models/repo';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmpReports } from '../../../reports/dialog-cmp-reports';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'repo-bond-order',
    templateUrl: './repo-bond-order.html',
})

export class RepoBondOrderComponent {

    public myForm: FormGroup;


    @ViewChild(RepoOrderComponent, { static: false }) repoOrder: RepoOrderComponent;
    @ViewChild(Notifications) notifications: Notification;

    participantId: number;
    participantCode: string
    lang: string;
    claims: any;
    loggedInUserType: string;
    tradeType: string;
    public userType = UserTypes;
    repo: Repo
    intra: boolean = true
    inter: boolean = false
    collateralList: any[];
    clientList: any[] = [];
    errorMessage: string;
    exchangeId: number = 0;
    marketId: number = 0;
    securityId: number = 0;
    repoTypeList: object[] = []
    counterBorkerList: object[] = []
    dateFormat: string = AppConstants.DATE_FORMAT;
    dateMask: string = AppConstants.DATE_MASK;


    @ViewChild('collateral', { static: false }) collateral: wjcInput.ComboBox;
    @ViewChild('cleanPrice', { static: false }) cleanPrice: wjcInput.ComboBox;
    @ViewChild('dirtyPrice', { static: false }) dirtyPrice: wjcInput.ComboBox;
    @ViewChild('quantity', { static: false }) quantity: wjcInput.ComboBox;

    @ViewChild('nominalValue', { static: false }) nominalValue: wjcInput.ComboBox;
    @ViewChild('marketValue', { static: false }) marketValue: wjcInput.ComboBox;
    @ViewChild('repoType', { static: false }) repoType: wjcInput.ComboBox;
    @ViewChild('haircut', { static: false }) haircut: wjcInput.ComboBox;

    @ViewChild('purchasePrice', { static: false }) purchasePrice: wjcInput.ComboBox;
    @ViewChild('initialDate', { static: false }) initialDate: wjcInput.InputDate;
    @ViewChild('repurchaseDate', { static: false }) repurchaseDate: wjcInput.InputDate;
    @ViewChild('repoInterestRate', { static: false }) repoInterestRate: wjcInput.ComboBox;

    @ViewChild('repurchasePrice', { static: false }) repurchasePrice: wjcInput.ComboBox;
    @ViewChild('account', { static: false }) account: wjcInput.ComboBox;

    @ViewChild('borker', { static: false }) borker: wjcInput.ComboBox;
    @ViewChild('counterBroker', { static: false }) counterBroker: wjcInput.ComboBox;
    @ViewChild('counterAccount', { static: false }) counterAccount: wjcInput.ComboBox;
    @ViewChild(DialogCmpReports) dialogCmp: DialogCmpReports;



    constructor(private appState: AppState, public authService: AuthService2, public authServiceOMS: AuthService, private dataService: DataServiceOMS,
        private listingService: ListingService, private toast: ToastrService,
        private _fb: FormBuilder, private translate: TranslateService, public shareOrderService: ShareOrderService, private loader: FuseLoaderScreenService,
        public cdr: ChangeDetectorRef, public router: Router, private socket: WebSocketService) {

        this.claims = this.authService.claims;
        this.loggedInUserType = AppConstants.userType;
        this.authService.tradeChange.subscribe((value) => {
            this.tradeType = value;
        });

        this.participantId = AppConstants.participantId;
        this.participantCode = AppConstants.participantCode
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________

    }

    ngOnDestroy(): void { }

    ngOnInit() {
        this.addFromValidations();
        this.clearFields();
    }

    ngOnChanges(): void {

    }
    radioClicked(type) {
        if (type === 'inter') {
            this.intra = false
            this.generatecounterBorkerList()

        } else if (type === 'intra') {
            this.intra = true
            this.repo.counterBroker = this.participantCode
        }
    }

    clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
          }
        this.repo = new Repo();
        this.intra = true
        this.collateralList = []
        this.clientList = []
        this.symbolList();


        this.repo.borker = this.participantCode


        const intra = document.getElementById('intra') as HTMLInputElement | null;
        if (intra != null) {
            intra.checked = true;
        }
        const inter = document.getElementById('inter') as HTMLInputElement | null;
        if (inter != null) {
            inter.checked = false;
        }
    }

    generateRepoTypeList() {
        let typeList: any[] = [];
        let cmbItem: ComboItem;
        cmbItem = new ComboItem('BuyBack', 'BB');
        typeList.push(cmbItem);
        cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
        typeList.unshift(cmbItem);
        this.repoTypeList = typeList
        this.repo.repoType = typeList[0].value
    }

    generatecounterBorkerList() {
        
        let borkerList: any[] = [];
        let cmbItem: ComboItem;
        cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
        borkerList.unshift(cmbItem);
        this.counterBorkerList = borkerList
        this.repo.counterBroker = borkerList[0].value
    }


    ngAfterViewInit(): void {

    }

    onClose() {
        jQuery('#repo-order').modal('hide');
        this.clearFields();
        AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
        AppConstants.isSelectedEquities = false;
    }

    resetForm(): void {

    }

    onSubmit(model: any, isValid: boolean) {

    }




    validateOrder(): boolean {
        let errorMsg: string = '';
        return true;
    }
    symbolList() {
        if (AppUtility.isValidVariable(AppConstants.participantId))

            this.listingService.getParticipantSecurityExchanges(AppConstants.participantId)
                .subscribe(restData => {
                    if (AppUtility.isValidVariable(restData)) {
                        this.updateSymbolList(restData);
                    }
                },
                    error => {
                        this.errorMessage = <any>error.message
                        this.toast.error(this.errorMessage, 'Error')
                    });
    }

    updateSymbolList(data) {
        let symbolList: any[] = [];
        let cmbItem: ComboItem;
        let bondIndex: number = 0;

        if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].marketTypeCode.toUpperCase() === AppConstants.MARKET_TYPE_BOND) {
                    symbolList[bondIndex] = data[i];
                    symbolList[bondIndex].value = data[i].displayName_;
                    bondIndex++;
                }
            }

            cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
            symbolList.unshift(cmbItem);
            this.repo.collateral = '';

        }
        this.collateralList = symbolList;
    }

    onSymbolChange(): void {
        this.repo.symbol = '';
        this.repo.market = '';
        this.repo.exchange = '';
        this.splitSymbolExchMkt();
        this.generateRepoTypeList()
        if (this.intra) {
            this.repo.counterBroker = this.participantCode
        }
        else {
            this.generatecounterBorkerList()
        }

    }



    splitSymbolExchMkt() {

        let strArr: any[];
        if (this.collateral.selectedValue != null && this.collateral.selectedValue.length > 0) {

            strArr = AppUtility.isSplitSymbolMarketExchange(this.collateral.selectedValue);
            this.repo.symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
            this.repo.market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
            this.repo.exchange = (typeof strArr[2] === 'undefined') ? '' : strArr[2];

            this.updateExchangeMarketIds();

            AppUtility.printConsole('symbol subscribed: ' + this.repo.symbol);
            if (this.dataService.isValidBondSymbol(this.repo.exchange, this.repo.market, this.repo.symbol)) {
                this.shareOrderService.setExchange(this.repo.exchange);
                this.shareOrderService.setMarket(this.repo.market);
                this.shareOrderService.setSymbol(this.repo.symbol);
                this.socket.fetchFromChannel("best_orders", { "exchange": this.repo.exchange, "market": this.repo.market, "symbol": this.repo.symbol });
                this.errorMessage = undefined;
                this.authServiceOMS.socket.emit('symbol_sub', { 'exchange': this.repo.exchange, 'market': this.repo.market, 'symbol': this.repo.symbol });
            }
        }
        else {
            this.clientList = [];
        }


    }

    updateExchangeMarketIds() {
        this.exchangeId = 0;
        this.marketId = 0;
        this.securityId = 0;
        if (AppUtility.isValidVariable(this.collateralList) && !AppUtility.isEmpty(this.collateralList)) {
            for (let i = 0; i < this.collateralList.length; i++) {
                if (this.collateralList[i].exchangeCode === this.repo.exchange &&
                    this.collateralList[i].marketCode === this.repo.market &&
                    this.collateralList[i].securityCode === this.repo.symbol) {

                    this.exchangeId = this.collateralList[i].exchangeId;
                    this.marketId = this.collateralList[i].marketId;
                    this.securityId = this.collateralList[i].securityId;
                    // this.repo.cleanPrice = this.collateralList[i].
                }
            }
            this.getClientsList(this.exchangeId);
        }
    }

    getClientsList(exchangeId) {
        this.loader.show();
        this.listingService.getClientListByExchangeBroker(exchangeId, AppConstants.participantId, true, true)
            .subscribe(restData => {
                this.loader.hide();
                if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                    this.clientList = restData;
                } else {
                    this.clientList = [];
                }
            },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error.message
                    this.toast.error(this.errorMessage, 'Error')

                });
    }

    addFromValidations() {
        this.myForm = this._fb.group({
            collateral: ['', Validators.compose([Validators.required])],
            cleanPrice: ['', Validators.compose([Validators.required])],
            dirtyPrice: ['', Validators.compose([Validators.required])],
            quantity: ['', Validators.compose([Validators.required])],
            nominalValue: ['', Validators.compose([Validators.required])],
            marketValue: ['', Validators.compose([Validators.required])],
            repoType: ['', Validators.compose([Validators.required])],
            haircut: ['', Validators.compose([Validators.required])],
            purchasePrice: ['', Validators.compose([Validators.required])],
            initialDate: ['', Validators.compose([Validators.required])],
            repurchaseDate: ['', Validators.compose([Validators.required])],
            repoInterestRate: ['', Validators.compose([Validators.required])],
            repurchasePrice: ['', Validators.compose([Validators.required])],
            account: ['', Validators.compose([Validators.required])],
            borker: ['', Validators.compose([Validators.required])],
            counterBroker: ['', Validators.compose([Validators.required])],
            counterAccount: ['', Validators.compose([Validators.required])],


        });
    }


}