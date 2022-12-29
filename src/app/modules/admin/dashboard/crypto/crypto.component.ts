import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ApexOptions} from "ng-apexcharts";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {DashboardService} from "../dashboard.service";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'crypto-dashboard',
    templateUrl: './crypto.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoComponent implements OnInit, OnDestroy {

    chartWeeklyExpenses: ApexOptions = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    data: any;
    cardData: { description?: string; title: string, pic: string, percentage?: number, }[] = [{
        title: 'Inc.',
        pic: 'assets/images/marlin-dashboard/gold.png',
        percentage: 9
    }, {
        title: 'Gold',
        pic: 'assets/images/marlin-dashboard/gold.png',
        percentage: 4
    }, {
        title: 'Bitcoin',
        pic: 'assets/images/marlin-dashboard/gold.png',
        percentage: 31
    }, {
        title: '3 Marla , 5 Marla',
        description: 'LDA Approved',
        pic: 'assets/images/marlin-dashboard/gold.png',
    }]

    constructor(
        private _router: Router,
        private dashboardService: DashboardService) {
    }

    ngOnInit(): void {

        this.dashboardService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.data = data;
                this._prepareChartData();
            });

        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private _fixSvgFill(element: Element): void {
        const currentURL = this._router.url;
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    private _prepareChartData(): void {
    }

}
