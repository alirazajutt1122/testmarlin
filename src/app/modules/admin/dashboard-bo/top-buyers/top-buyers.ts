import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/app.utility';
import { DashboardBoService } from '../dashboard-bo.service';



@Component({
    selector: 'top-buyers',
    templateUrl: './top-buyers.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class TopBuyersComponent implements OnInit, AfterViewInit {
    lang: string;
    dataLimitVal: number;
    dataSortType: string;
    dataLimit: any[] = [
        { id: 5, value: 'Top 5' },
        { id: 10, value: 'Top 10' },
        { id: 20, value: 'Top 20' },
    ]

    dataSort: any[] = [
        { id: 'value', value: 'Value' },
        { id: 'volume', value: 'Volume' },
    ]

    tableColumns: string[] = ['Code', 'Name', 'Value', 'Volume'];

    data: MatTableDataSource<any> = new MatTableDataSource();
    participantId: number

    @Input() fromDate = '';
    @Input() toDate = '';

    initialData: any[] = []

    constructor(private translate: TranslateService, private dashboardBoService: DashboardBoService, private splash: FuseLoaderScreenService,) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________

        this.participantId = AppConstants.claims2.participant.id
        this.dataLimitVal = this.dataLimit[1].id
        this.dataSortType = this.dataSort[0].id
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getTopBuyers()
    }

    ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
    }

    dataLimitChanges(val) {
        this.getTopBuyers()
    }

    sortData(val) {
        this.getTopBuyers()
    }

    getTopBuyers() {
        this.splash.show();
        this.dashboardBoService.topBuyers(this.participantId, this.fromDate, this.toDate, this.dataSortType, this.dataLimitVal).subscribe(res => {
            this.splash.hide();
            if (this.dataSortType == 'value') {
                res = res.sort(function (a, b) { return b.totalValue - a.totalValue });
            }
            else if (this.dataSortType == 'volume') {
                res = res.sort(function (a, b) { return b.totalVolume - a.totalVolume });
            }
           

            this.data.data = res

        }, error => {
            this.splash.hide();
        });

    }



}