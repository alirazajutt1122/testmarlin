import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { TranslateService } from "@ngx-translate/core";
import { AppState } from "app/app.service";
import { AppConstants } from "app/app.utility";
import { MBOData, MBPData } from "app/modules/admin/dashboard/oder-book-dashboard/order-book-dashboard";
import { DataServiceOMS } from "app/services-oms/data-oms.service";
import { ListingService } from "app/services-oms/listing-oms.service";
import { OrderService } from "app/services-oms/order-oms.service";
import { AuthService2 } from "app/services/auth2.service";
import { WebSocketService } from "app/services/socket/web-socket.service";
import { environment } from "environments/environment";
import { Subject } from "rxjs";
import * as io from 'socket.io-client';
import { ShareOrderService } from "../order.service";

@Component({
    selector: 'order-book-shared',
    templateUrl: './order-book-shared.html',
    styleUrls: ['../components.style.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class OrderBookShared implements OnInit, AfterViewInit {


    public _unsubscribeAll: Subject<any> = new Subject<any>();
    mboDataSource: MatTableDataSource<any> = new MatTableDataSource();

    mboDataColumns: string[] = ['price', 'volume'];
    recentTransactionsTableColumnsForDividends: string[] = ['date', 'name'];
    selectedAssetClass: string = 'equities';
    buyColor: any;
    sellColor: any;
    colorByType: string;

    mboDataArr: MBOData[] = new Array();
    mboDataSellArr: MBOData[] = new Array();
    mbpDataArr: MBPData[] = new Array();

    mboBuyDataSource: MatTableDataSource<any> = new MatTableDataSource();
    mboSellDataSource: MatTableDataSource<any> = new MatTableDataSource();

    isHasData : Boolean = false;

    mboBuyBoldDataSource: MatTableDataSource<any> = new MatTableDataSource();
    dummyMboDataArr = [
        {
            price: 40,
            amount: 6.78,
            type: "buy",
            colorByType: ""
        }, {
            price: 20,
            amount: 6.78,
            type: "sell",
            colorByType: ""
        }, {
            price: 50,
            amount: 6.78,
            type: "buy",
            colorByType: ""
        }, {
            price: 20,
            amount: 6.78,
            type: "sell",
            colorByType: ""
        }, {
            price: 60,
            amount: 6.78,
            type: "buy",
            colorByType: ""
        }, {
            price: 20,
            amount: 6.78,
            type: "sell",
            colorByType: ""
        }, {
            price: 70,
            amount: 6.78,
            type: "buy",
            colorByType: ""
        }, {
            price: 20,
            amount: 6.78,
            type: "sell",
            colorByType: ""
        }, {
            price: 80,
            amount: 6.78,
            type: "buy",
            colorByType: ""
        }, {
            price: 20,
            amount: 6.78,
            type: "sell",
            colorByType: ""
        }, {
            price: 90,
            amount: 6.78,
            type: "buy",
            colorByType: ""
        }, {
            price: 20,
            amount: 6.78,
            type: "sell",
            colorByType: ""
        }]

    buyArr: Array<any> = []
    buyBoldArr: Array<any> = []
    sellArr: Array<any> = []
    buySellArr: Array<any> = []







    tradeType: string;
    participantId: number;
    claims: any;
    loggedInUserType: string;
    lang: string;
    socketIO: any;
    exchange: string;
    market: string;
    symbol: string;
    orderDataShared: string;


    constructor(private appState: AppState, public authService: AuthService2, private dataService: DataServiceOMS,
        private listingService: ListingService, private orderService: OrderService,
        private _fb: FormBuilder, private translate: TranslateService, public sharedOrderService: ShareOrderService, public auth2Service: AuthService2, private socket : WebSocketService) {

        this.socketIO = io(environment.socketUrl)

        this.participantId = AppConstants.participantId;
        this.claims = this.authService.claims;
        this.loggedInUserType = AppConstants.userType;
        this.tradeType = AppConstants.tradeType;
        this.buyColor = AppConstants.buyColor;
        this.sellColor = AppConstants.sellColor;
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }










    ngOnInit(): void {

        this.onFetchMBOData();
        this.sharedOrderService.getExchange().subscribe(data => { this.exchange = data });
        this.sharedOrderService.getMarket().subscribe(data => { this.market = data });
        this.sharedOrderService.getSymbol().subscribe(data => { this.symbol = data });



    }

    ngOnDestroy(): void {

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }



    ngAfterViewInit(): void {
        
        this.onFetchMBOData();
    }





    onFetchMBOData(): void {
         
        this.socket.onFetchDataFromChannel('best_orders').subscribe((data: any) => {
            let mboArrIndex = 0;
            this.mboDataArr = new Array<MBOData>();
            this.mboDataSellArr = new Array<MBOData>();
            //this.mboData = <MBOData> data;
            let mboData = null;
            if (data === null) {
                this.mboDataArr = null;
                this.mboDataSellArr = null;
                this.mboDataArr = new Array<MBOData>();
                this.mboDataSellArr = new Array<MBOData>();
                let mboData = null;
                this.isHasData = false;
                this.mboBuyDataSource.data = [];
                this.mboSellDataSource.data = [];
            }

            if (data !== null && this.exchange === data.exchange && this.market === data.market && this.symbol === data.symbol) {
                // mbo buy_order
                if (data.buy_orders != null && data.buy_orders !== undefined && Array.isArray(data.buy_orders)) {
                    data.buy_orders.forEach(element => {
                        mboData = new MBOData();
                        mboData.buy_volume = element.volume;
                        mboData.buy_price = element.price;
                        this.mboDataArr.push(mboData);
                        this.isHasData = true;
                    });
                    if (this.mboDataArr.length > 4) {
                        let temp = this.mboDataArr.slice(0, 5);
                        this.mboBuyDataSource.data = temp;
                    }
                    else {
                        this.mboBuyDataSource.data = this.mboDataArr;
                    }
                }
                // mbo sell_orders
                if (data.sell_orders != null && data.sell_orders !== undefined && Array.isArray(data.sell_orders)) {
                    data.sell_orders.forEach(element => {
                        mboData = new MBOData();
                        mboData.sell_volume = element.volume;
                        mboData.sell_price = element.price;
                        this.mboDataSellArr.push(mboData);
                        this.isHasData = true;
                    });
                    if (this.mboDataSellArr.length > 4) {
                        let temp = this.mboDataSellArr.slice(0, 5);
                        this.mboSellDataSource.data = temp.reverse();
                    }
                    else {
                        this.mboSellDataSource.data = this.mboDataSellArr.reverse();
                    }
                }
            }

        });






    }















    colorOnBuySell() {
        for (let i = 0; i < this.mboDataArr.length; i++) {
            if (this.dummyMboDataArr[i].type == "buy") {
                this.buyArr.push(this.dummyMboDataArr[i])
            }
            else {
                this.sellArr.push(this.dummyMboDataArr[i])
            }
        }

        this.buyBoldArr.unshift(this.buyArr[0])
        this.mboBuyBoldDataSource.data = this.buyBoldArr
        this.buyArr.shift()

        this.mboBuyDataSource.data = this.buyArr
        this.mboSellDataSource.data = this.sellArr;
        ;



        this.dummyMboDataArr = this.buyArr
    }



}
