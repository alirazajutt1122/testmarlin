import { Component, Inject, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';

@Component({
    selector: 'negotiated-deals-list',
    templateUrl: './negotiated-deals-list.html',
})

export class NegotiatedDealsListComponent {

    selectedAssetClass: string = AppConstants.ASSET_CLASS_EQUITIES;
    lang: string;
    tradeType: string;

    constructor(private translate: TranslateService,public authService: AuthService2,) {

        this.tradeType = AppConstants.tradeType;

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }

    

}