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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardBoService } from '../dashboard-bo.service';


@Component({
    selector: 'top-performers',
    templateUrl: './top-performers.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class TopPerformersComponent implements OnInit {
    lang: string;
    dataLimitVal: number;
    dataLimit: any[] = [
        { id: 5, value: 'Top 5' },
        { id: 10, value: 'Top 10' },
        { id: 20, value: 'Top 20' },
    ]
    dataSortType: string;
    dataSort: any[] = [
        { id: 'value', value: 'Value' },
        { id: 'volume', value: 'Volume' },
    ]
    tableColumns: string[] = ['Security', 'Value', 'Volume'];
    marketList: any[] = []
    selectedMarketCode: string
    data: MatTableDataSource<any> = new MatTableDataSource();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    todayDate: string
    errorMessage: any;
    chartData: any[];
    participantId: any;

    constructor(private translate: TranslateService, private listingService: ListingService, private loader: FuseLoaderScreenService, private dashboardService: DashboardBoService) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
        this.participantId = AppConstants.claims2.participant.id
        this.dataLimitVal = this.dataLimit[1].id
        this.dataSortType = this.dataSort[0].id

    }

    ngOnInit(): void {
        this.todayDate = AppUtility.formatDate_YYYY_MM_DD(new Date)
        this.dashboardService.marketList
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if (data.length != 0) {
                    this.marketList = data;
                    this.selectedMarketCode = this.marketList[3].marketCode
                    this.getTopPerformers()
                }
            });

    }

    dataLimitChanges(val) {
        this.getTopPerformers()
    }

    onMarketChange() {
        this.getTopPerformers()
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getTopPerformers() {

        this.dashboardService.getTopPerformers(this.participantId, this.selectedMarketCode, this.dataSortType, this.dataLimitVal).subscribe(res => {

            res.map(a => {
                if (a.imageUrl == null) {
                    a.imageUrl = 'assets/img/settlement.png'
                }
            })
            this.chartData = res
            this.data.data = res
        })
    }

}