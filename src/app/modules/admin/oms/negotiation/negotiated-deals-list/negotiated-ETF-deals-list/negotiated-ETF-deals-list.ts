import { Component, Inject, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

@Component({
    selector: 'negotiated-ETF-deals-list',
    templateUrl: './negotiated-ETF-deals-list.html',
})

export class NegotiatedETFDealsListComponent {


    filterColumns = ['assetClass', 'symbol', 'side', 'price', 'quantity', 'sellerAccount', 'sellerBroker', 'sellerCustodian', 'sellerUser',
    'buyerAccount','buyerBroker', 'buyerCustodian','buyerUser', 'initiator', 'status'];

    lang: string;
    private _pageSize = 0;
    private _pageSize2 = 0;
    dataInitiatedByMe: any = [];
    dataInitiatedForMe: any = [];

    @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;
    @ViewChild('flexGrid2', { static: false }) flexGrid2: wjcGrid.FlexGrid;

    constructor(private translate: TranslateService, public authService: AuthService2,) {

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }

    // -------------------------------------------------------------------------
    get pageSize1(): number {
        return this._pageSize;
    }
    // -------------------------------------------------------------------------
    set pageSize1(value: number) {
        if (this._pageSize !== value) {
            this._pageSize = value;
            if (this.flexGrid) {
                (<wjcCore.IPagedCollectionView>this.flexGrid.collectionView).pageSize = value;
            }
        }
    }
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    get pageSize2(): number {
        return this._pageSize2;
    }
    // -------------------------------------------------------------------------
    set pageSize2(value: number) {
        if (this._pageSize2 !== value) {
            this._pageSize2 = value;
            if (this.flexGrid2) {
                (<wjcCore.IPagedCollectionView>this.flexGrid2.collectionView).pageSize = value;
            }
        }
    }
    // -------------------------------------------------------------------------

}