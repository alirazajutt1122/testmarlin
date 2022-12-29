import {
    Component,
    Inject,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppUtility } from 'app/app.utility';
import { DashboardBoService } from './dashboard-bo.service';


@Component({
    selector: 'dashboard-bo',
    templateUrl: './dashboard-bo.html',
    styleUrls: ['./dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardBoComponent implements OnInit {

    parentFromDate: any
    parentToDate: any

    campaignOne = new FormGroup({
        start: new FormControl(new Date),
        end: new FormControl(new Date),
    });

    constructor(private dashboardBOService: DashboardBoService) {

    }

    ngOnInit(): void {
        this.parentFromDate = AppUtility.formatDate_YYYY_MM_DD(this.campaignOne.value.start)
        this.parentToDate = AppUtility.formatDate_YYYY_MM_DD(this.campaignOne.value.end)
    }

    onClosePicker(event) {
        this.parentFromDate = AppUtility.formatDate_YYYY_MM_DD(event.value.start)
        this.parentToDate = AppUtility.formatDate_YYYY_MM_DD(event.value.end)
    }

}
