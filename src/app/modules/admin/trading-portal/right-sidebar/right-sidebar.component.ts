import {Component, ViewEncapsulation} from '@angular/core';
import {FuseNavigationItem} from '@fuse/components/navigation/navigation.types';

@Component({
    selector: 'trading-portal-sidebar',
    template: `
        <div class="py-10">
            <div class="extra-content">
                <ng-content></ng-content>
            </div>
            <div class="mx-6 text-3xl font-bold tracking-tighter">News & Advertisement</div>
            <fuse-vertical-navigation
                [appearance]="'default'"
                [navigation]="menuData"
                [inner]="true"
                [mode]="'side'"
                [name]="'demo-sidebar-navigation'"
                [opened]="true"></fuse-vertical-navigation>

        </div>
    `,
    styles: [
        `
            demo-sidebar fuse-vertical-navigation .fuse-vertical-navigation-wrapper {
                box-shadow: none !important;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
})
export class TradingPortalSidebar {
    menuData: FuseNavigationItem[];

    constructor() {
        this.menuData = [
            {
                title: 'News',
                subtitle: 'Acheive',
                type: 'group',
                children: [
                    {
                        title: 'Integrating with Crypto Engines',
                        type: 'basic',
                        icon: 'heroicons_outline:currency-dollar'
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Launching Commodities Trading',
                        type: 'basic',
                        icon: 'heroicons_outline:briefcase'
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Launching Real Estate Investments',
                        type: 'basic',
                        icon: 'heroicons_outline:academic-cap'
                    },
                ]
            },
            {
                title: 'Advertisement',
                subtitle: 'Acheive',
                type: 'group',
                children: []
            },
        ];
    }
}
