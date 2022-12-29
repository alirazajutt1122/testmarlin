import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wijmo from '@grapecity/wijmo';
import * as chart from '@grapecity/wijmo.chart';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/app.utility';
import { DashboardBoService } from '../dashboard-bo.service';

@Component({
    selector: 'dashboard-bo-client',
    templateUrl: './dashboard-bo-client.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
})




export class DashboardBoClientComponent implements OnInit {

    trades: string = "0";
    total: number = 0;
    active: number = 0;
    inActive: number = 0;

    Wjdata: any[];
    lang: string;
    participantId: number

    @Input() fromDate = '';
    @Input() toDate = '';


    constructor(private translate: TranslateService, private dashboardBoService: DashboardBoService, private splash: FuseLoaderScreenService,) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________

        this.participantId = AppConstants.claims2.participant.id
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setClientsData()
    }

    ngOnInit(): void {
    }

    getLabelContent = (ht: chart.HitTestInfo) => {
        return wijmo.format('{name} {val}', { val: ht.value });
    }

    setClientsData() {
        this.splash.show();
        this.dashboardBoService.participantClientsData(this.participantId, this.fromDate, this.toDate).subscribe((res) => {
            this.splash.hide();

            this.active = res[0].activeClients
            this.inActive = res[0].inactiveClients
            this.total = res[0].totalClients
            this.trades = res[0].totalTrades
            this.Wjdata = this.getData();
        }, error => {
            this.splash.hide();
        });
    }

    getData() {
        return [
            { type: 'InActive', trade: this.inActive },
            { type: 'Active', trade: this.active },

        ];
    }

}