import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {Subject} from "rxjs";
import {FuseMediaWatcherService} from "@fuse/services/media-watcher";
import {takeUntil} from "rxjs/operators";
import {User} from "../../../../app/core/user/user.types";

@Component({
    selector: 'account-registration',
    templateUrl: './account-registration.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountRegistrationComponent implements OnInit, OnDestroy {    
    @ViewChild('drawer') drawer: MatDrawer;

    user: User; 
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'initial';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    newRegistration: boolean = true;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
    }

    ngOnInit(): void {
        this.panels = [
            {
                id: 'already-have-otp',
                icon: 'app_registration',
                title: 'Already Have OTP',
                description: 'Already Have OTP. Use that OTP to confirm'
            }, {
                id: 'initial',
                icon: 'heroicons_outline:user-circle',
                title: 'Initial Registration',
                description: 'Manage your public profile and ``private information'
            },
        ];

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
                this._changeDetectorRef.markForCheck();
            });

            this.user = JSON.parse(localStorage.getItem("user")); 

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    goToPanel(panel: string): void {
        this.selectedPanel = panel;
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
