import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import {FuseMediaWatcherService} from "../../../../@fuse/services/media-watcher";
import {BackofficeService} from "./backoffice.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-back-office',
    templateUrl: './back-office.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackOfficeComponent implements OnInit, OnDestroy {
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    linkToDashboard: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _fuseMediaWatcherService: FuseMediaWatcherService,
                private backOfficeService: BackofficeService,
                private sanitizer: DomSanitizer,
                private toasterService: ToastrService) {
        this.goToMarlinDashboard();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    goToMarlinDashboard() {
        this.backOfficeService.getMarlinPSXUser().subscribe(data => {
            if (data.length) {
                const link = `http://192.168.36.61:3001/#/portal-login/?mi=${data[0]?.email}&pup=${data[0]?.productUserPasscode}`;
                this.linkToDashboard = this.sanitizer.bypassSecurityTrustResourceUrl(link);
            } else {
                this.toasterService.info('Not Member of Back Office', 'Back Office');
            }
        }, error => {
            this.toasterService.error('Something went wrong.', 'Error')
        })
    }
}
