import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { ApexOptions } from "ng-apexcharts";
import { Subject } from "rxjs";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { UserService } from 'app/core/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppUtility } from 'app/app.utility';

@Component({
    selector: 'trending-dashboard',
    templateUrl: './trending.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [trigger('cardFlip', [
        state('default', style({
            transform: 'none'
        })),
        state('flipped', style({
            transform: 'rotateY(360deg)'
        })),
        transition('default => flipped', [
            animate('1000ms')
        ]),
        transition('flipped => default', [
            animate('1000ms')
        ]),
    ])
    ]
})
export class TrendingComponent implements OnInit, OnDestroy {

    watchlistChartOptions: ApexOptions = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    stateIncCard: string = 'flipped';
    stateCryptoCard: string = 'default';
    stateCommoditiesCard: string = 'default';






    incCardData: {
        title: string,
        pic: {},
        percentage: string,
        volume: number,
        dir: string,
        bidPrice: string,
        series: [{}]
    }


    // incCardData = {
    //     title: '',
    //     pic :   {},
    //     percentage: '',
    //     volume: 0,
    //     dir: 'down',
    //     bidPrice : '',
    //     "series": [
    //         {
    //             "name": "Price",
    //             "data": [
    //                 {
    //                     "x": "15:46",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 },
    //                 {
    //                     "x": "15:55",
    //                     "y": 141.06
    //                 }, {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:48",
    //                     "y": 146.94
    //                 },
    //                 {
    //                     "x": "15:49",
    //                     "y": 146.96
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 }, {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:48",
    //                     "y": 146.94
    //                 },
    //                 {
    //                     "x": "15:49",
    //                     "y": 146.96
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 }, {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:48",
    //                     "y": 146.94
    //                 },
    //                 {
    //                     "x": "15:49",
    //                     "y": 146.96
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 }, {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:48",
    //                     "y": 146.94
    //                 },
    //                 {
    //                     "x": "15:49",
    //                     "y": 146.96
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 }, {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:48",
    //                     "y": 146.94
    //                 },
    //                 {
    //                     "x": "15:49",
    //                     "y": 146.96
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 }, {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:48",
    //                     "y": 146.94
    //                 },
    //                 {
    //                     "x": "15:49",
    //                     "y": 146.96
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 }, {
    //                     "x": "15:47",
    //                     "y": 154.36
    //                 },
    //                 {
    //                     "x": "15:48",
    //                     "y": 146.94
    //                 },
    //                 {
    //                     "x": "15:49",
    //                     "y": 146.96
    //                 },
    //                 {
    //                     "x": "15:54",
    //                     "y": 145.36
    //                 },
    //             ]
    //         }
    //     ]
    // };
    commoditiesCardData = {
        title: 'OF07U23A',
        pic: 'assets/images/marlin-dashboard/BONDS.png',
        percentage: '-0.76',
        volume: 602,
        dir: 'down',
        "series": [
            {
                "name": "Price",
                "data": [
                    {
                        "x": "15:46",
                        "y": 154.36
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    },
                    {
                        "x": "15:55",
                        "y": 141.06
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    },
                ]
            }
        ]
    };
    cryptoCardData = {
        title: 'OF24D22A',
        pic: 'assets/images/marlin-dashboard/BONDS.png',
        percentage: '+12.70',
        volume: 227,
        dir: 'up',
        "series": [
            {
                "name": "Price",
                "data": [
                    {
                        "x": "15:46",
                        "y": 154.36
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    },
                    {
                        "x": "15:55",
                        "y": 141.06
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    }, {
                        "x": "15:47",
                        "y": 154.36
                    },
                    {
                        "x": "15:48",
                        "y": 146.94
                    },
                    {
                        "x": "15:49",
                        "y": 146.96
                    },
                    {
                        "x": "15:54",
                        "y": 145.36
                    },
                ]
            }
        ]
    };


    setIntervalForFlip;

    constructor(private ref: ChangeDetectorRef, private _userService: UserService, private sanitizer: DomSanitizer,) {



    }

    ngOnInit(): void {
        this._prepareChartData();
        this.newData();
        this.getMinData();

    }


    ngOnDestroy(): void {
        clearInterval(this.setIntervalForFlip)
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }







    getMinData(): void {

        this._userService.lowestBidChangeData$.subscribe((res: any) => {
            if (AppUtility.isValidVariable(res)) {
                //   let objectURL = 'data:image/png;base64,' + res.securityImage;
                //   let src = this.sanitizer.bypassSecurityTrustUrl(objectURL);

                let src = (res.securityStatsDTO.imgUrl == null) ? 'assets/img/settlement.png' : res.securityStatsDTO.imgUrl;
                let ser = res.data.map(ele => {
                    ele.y = ele.currentPrice;
                    ele.x = new Date(ele.entryDatetime).getHours();
                });

                this.incCardData = {
                    title: res.securityCode,
                    pic: src,
                    percentage: res.securityStatsDTO?.change,
                    bidPrice: res.bidPrice,
                    volume: res.bidQuantity,
                    dir: res.securityStatsDTO?.change.startsWith('-') ? 'down' : 'up',
                    series: [{
                        'name': 'Price',
                        'data': [...res.data]
                    }],
                };
            }

            if(!AppUtility.isValidVariable(res)){
                   this.incCardData = {
                    title: '',
                    pic: '',
                    percentage: '0.0',
                    bidPrice: '0.0',
                    volume: 0,
                    dir: 'up',
                    series: [{
                        'name': 'Price',
                        'data': []
                    }],
                   }
            }





        });
    }




    getMaxData(): void {
        this._userService.highestBidChangeData$.subscribe((res: any) => {


            if (AppUtility.isValidVariable(res)) {

                // let objectURL = 'data:image/png;base64,' + res.securityImage;
                // let src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                let src = (res.securityStatsDTO.imgUrl == null) ? 'assets/img/settlement.png' : res.securityStatsDTO.imgUrl;
                let ser = res.data.map(ele => {
                    ele.y = ele.currentPrice;
                    ele.x = new Date(ele.entryDatetime).getHours();
                });

                this.incCardData = {
                    title: res.securityCode,
                    pic: src,
                    percentage: res.securityStatsDTO?.change,
                    bidPrice: res.bidPrice,
                    volume: res.bidQuantity,
                    dir: res.securityStatsDTO?.change.startsWith('-') ? 'down' : 'up',
                    series: [{
                        'name': 'Price',
                        'data': [...res.data]
                    }],
                };
            }

            if(!AppUtility.isValidVariable(res)){
                this.incCardData = {
                 title: '',
                 pic: '',
                 percentage: '0.0',
                 bidPrice: '0.0',
                 volume: 0,
                 dir: 'up',
                 series: [{
                     'name': 'Price',
                     'data': []
                 }],
                }
         }



        });
    }












    newData(): void {


        this.getMaxData();
        let index = 0;

        this.setIntervalForFlip = setInterval(() => {
            index++;
            if (index % 2 === 0) {
                this.getMaxData();
            }
            if (index % 2 !== 0) {
                this.getMinData();
            }

            this.stateIncCard = index % 2 === 0 ? 'flipped' : 'default';
            this.ref.markForCheck();
        }, 4000)
    }





    private _prepareChartData(): void {
        this.watchlistChartOptions = {
            chart: {
                animations: {
                    enabled: false
                },
                width: '100%',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true
                }
            },
            colors: ['#A0AEC0'],
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            tooltip: {
                enabled: false
            },
            xaxis: {
                type: 'category'
            }
        };
    }








}
