import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class FuseLoaderScreenService
{
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: any,
        private _router: Router
    )
    {

        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                this.hide();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the splash screen
     */
    show(): void
    {

        this._document.body.classList.remove('fuse-loader-screen-hidden');
    }

    /**
     * Hide the splash screen
     */
    hide(): void
    {

        this._document.body.classList.add('fuse-loader-screen-hidden');
    }




}
