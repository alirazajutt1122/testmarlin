import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { DashboardBoService } from '../../dashboard-bo.service';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';


@Component({
    selector: 'delivery-obligation',
    templateUrl: './delivery-obligation.html',
    styleUrls: ['../../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class DeliveryObligationComponent implements OnInit, AfterViewInit {
    lang: string;
    marketList: any[] = []
    errorMessage: any;
    marketId: number
    date: string = ''
    selectedMarketCode: string
    data: MatTableDataSource<any> = new MatTableDataSource();
    tableColumns: string[] = ['security', 'buy_volume', 'sell_volume', 'net_volume']
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    participantId: any;

    constructor(private translate: TranslateService, private listingService: ListingService, private loader: FuseLoaderScreenService, private dashboardService: DashboardBoService) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
        this.participantId = AppConstants.claims2.participant.id
    }

    ngOnInit(): void {
        this.dashboardService.marketList
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                if (data.length != 0) {
                    this.marketList = data;
                    this.selectedMarketCode = this.marketList[3].marketCode
                    this.getDeliverObligations()
                }

            });

        this.date = AppUtility.formatDate_YYYY_MM_DD(new Date)

    }

    public ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onMarketChange() {
        this.getDeliverObligations()
    }

    getDeliverObligations() {
        if (this.selectedMarketCode != null && this.selectedMarketCode != undefined && this.selectedMarketCode != "Select") {
            this.dashboardService.getDeliveryObligationData(this.participantId, this.selectedMarketCode).subscribe(res => {
                res.map(a => {
                    if (a.imageUrl == null) {
                        a.imageUrl = 'assets/img/settlement.png'
                    }
                })
                this.data.data = res
            })
        }
        else {
            this.data.data = []
        }
    }


}