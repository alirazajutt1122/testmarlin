import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ToastrService } from 'ngx-toastr';
import { DashboardBoService } from '../dashboard-bo.service';



@Component({
    selector: 'system-stats',
    templateUrl: './system-stats.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class SystemStatsComponent implements OnInit, AfterViewInit {
    lang: string;
    participantId: any;
    todayDate: string
    statsData:any[]=[{}]

    constructor(private translate: TranslateService, private dashboardService: DashboardBoService, private splash: FuseLoaderScreenService, private toast: ToastrService,) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
        this.participantId = AppConstants.claims2.participant.id
    }

    ngOnInit(): void {
        this.todayDate = AppUtility.formatDate_YYYY_MM_DD(new Date)
        this.getSystemStats()
    }


    public ngAfterViewInit(): void {

    }

    getSystemStats() {
        this.dashboardService.systemStats(this.participantId, this.todayDate).subscribe(res => {
            res
            this.statsData = res
        }, (error) => {
            this.splash.hide();
            let msg = "Something went wrong with system stats"
            this.toast.error(msg, 'Error');
        })
    }

    // formatDate_YYYY_MM_DD(date) {
    //     var d = new Date(date),
    //         month = '' + (d.getMonth() + 1),
    //         day = '' + d.getDate(),
    //         year = d.getFullYear();

    //     if (month.length < 2)
    //         month = '0' + month;
    //     if (day.length < 2)
    //         day = '0' + day;
    //     return [year, month, day].join('-');
    // }


}