import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { DashboardBoService } from '../../dashboard-bo.service';

@Component({
    selector: 'cash-obligation',
    templateUrl: './cash-obligation.html',
    styleUrls: ['../../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})


export class CashObligationComponent implements OnInit, AfterViewInit {
    lang: string;
    tableColumns: string[] = ['Market', 'Side', 'Value', 'NetCash'];
    data: MatTableDataSource<any> = new MatTableDataSource();
    totalCash: number = 0
    date: string = ''
    participantId: any;

    constructor(private translate: TranslateService, private dashboardBoService: DashboardBoService) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
        this.participantId = AppConstants.claims2.participant.id
    }

    ngOnInit(): void {
        this.date = AppUtility.formatDate_YYYY_MM_DD(new Date)
        this.getCashObligationData()
    }

    public ngAfterViewInit(): void {

    }

    getCashObligationData() {
        this.dashboardBoService.getCahsObligationData(this.participantId).subscribe(res => {
            
            let total = { value: "Net Obligation", netObligation: 0, total: true }
            res.map(a => {
                
                a.buy = "Buy"
                a.sell = "Sell"
                total.netObligation += Number(a.net)
                a.total = false

            })

            res.push(total)
            this.data.data = res
        })

    }



}