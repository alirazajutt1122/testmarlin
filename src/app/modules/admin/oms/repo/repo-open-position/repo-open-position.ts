import { Component, Inject, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/app.utility';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

@Component({
    selector: 'repo-open-position',
    templateUrl: './repo-open-position.html',
})

export class RepoOpenPositionComponent {

    lang: string;

    constructor(private translate: TranslateService,) {

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }


}