import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {take} from 'rxjs/operators';
import {AvailableLangs, TranslocoService} from '@ngneat/transloco';
import {FuseNavigationService, FuseVerticalNavigationComponent} from '@fuse/components/navigation';

@Component({
    selector: 'languages',
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages'
})
export class LanguagesComponent implements OnInit, OnDestroy {
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _translocoService: TranslocoService
    ) {
    }

    ngOnInit(): void {
        this.availableLangs = this._translocoService.getAvailableLangs();
        this._translocoService.langChanges$.subscribe((activeLang) => {
            this.activeLang = activeLang;
            this._updateNavigation(activeLang);
        });
        this.flagCodes = {
            'EN': 'us',
            'Tr': 'tr'
        };
    }

    ngOnDestroy(): void {
    }

    setActiveLang(lang: string): void {
        this._translocoService.setActiveLang(lang);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _updateNavigation(lang: string): void {
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');
        if (!navComponent) {
            return null;
        }
        const navigation = navComponent.navigation;
        const projectDashboardItem = this._fuseNavigationService.getItem('dashboards.project', navigation);
        if (projectDashboardItem) {
            this._translocoService.selectTranslate('Project').pipe(take(1))
                .subscribe((translation) => {
                    projectDashboardItem.title = translation;
                    navComponent.refresh();
                });
        }
        const analyticsDashboardItem = this._fuseNavigationService.getItem('dashboards.analytics', navigation);
        if (analyticsDashboardItem) {
            this._translocoService.selectTranslate('Analytics').pipe(take(1))
                .subscribe((translation) => {
                    analyticsDashboardItem.title = translation;
                    navComponent.refresh();
                });
        }
    }
}
