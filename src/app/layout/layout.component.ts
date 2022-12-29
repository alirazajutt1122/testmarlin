import {Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {combineLatest, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {FuseConfigService} from '@fuse/services/config';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {FUSE_VERSION} from '@fuse/version';
import {Layout} from 'app/layout/layout.types';
import {AppConfig} from 'app/core/config/app.config';

@Component({
    selector: 'layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, OnDestroy {
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) private _document: any,
        private _renderer2: Renderer2,
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
    }

    ngOnInit(): void {
        combineLatest([
            this._fuseConfigService.config$,
            this._fuseMediaWatcherService.onMediaQueryChange$(['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)'])
        ]).pipe(
            takeUntil(this._unsubscribeAll),
            map(([config, mql]) => {

                const options = {
                    scheme: config.scheme,
                    theme: config.theme
                };
                if (config.scheme === 'auto') {
                    options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
                }

                return options;
            })
        ).subscribe((options) => {

            this.scheme = options.scheme;
            this.theme = options.theme;

            this._updateScheme();
            this._updateTheme();
        });
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {
                this.config = config;
                this._updateLayout();
            });

        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {
            this._updateLayout();
        });

        this._renderer2.setAttribute(this._document.querySelector('[ng-version]'), 'fuse-version', FUSE_VERSION);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private _updateLayout(): void {
        let route = this._activatedRoute;
        while (route.firstChild) {
            route = route.firstChild;
        }
        this.layout = this.config.layout;
        const layoutFromQueryParam = (route.snapshot.queryParamMap.get('layout') as Layout);
        if (layoutFromQueryParam) {
            this.layout = layoutFromQueryParam;
            if (this.config) {
                this.config.layout = layoutFromQueryParam;
            }
        }
        const paths = route.pathFromRoot;
        paths.forEach((path) => {
            if (path.routeConfig && path.routeConfig.data && path.routeConfig.data.layout) {
                this.layout = path.routeConfig.data.layout;
            }
        });
    }

    private _updateScheme(): void {
        this._document.body.classList.remove('light', 'dark');
        this._document.body.classList.add(this.scheme);
    }

    private _updateTheme(): void {
        this._document.body.classList.forEach((className: string) => {
            if (className.startsWith('theme-')) {
                this._document.body.classList.remove(className, className.split('-')[1]);
            }
        });
        this._document.body.classList.add(`theme-${this.theme}`);
    }
}
