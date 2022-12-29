import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { Router } from "@angular/router";
import { AppInjector } from "../../../../app.module";
import { NewsAdvertisementService } from '../../news_advertisements/news_advertisements.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DashboardService } from '../dashboard.service';
import * as xml2js from 'xml2js';
import { BehaviorSubject, Subject } from 'rxjs';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'recent-news',
    templateUrl: './recent-news.component.html',
    styleUrls: ['./recent-news.component.scss'],

    encapsulation: ViewEncapsulation.None,
})
export class RecentNewsComponent implements OnInit {
    menuData: FuseNavigationItem[];
    naActiveDate: []
    rssData: string;
    rssTitle: string;
    rssFilterData$ = new BehaviorSubject<object>([]);
    rssFilterData: object[] = [];

    constructor(
        private news_advertisement_Service: NewsAdvertisementService,
        private dashboard_Service: DashboardService,
        private sanitizer: DomSanitizer,
        private loader : FuseLoaderScreenService,
        private toast: ToastrService,
        ) {

    }

    ngOnInit() {
        this.getRssData();
    }

    openLink(link) {
        window.open(link);
    }

    getRssData() {
        this.loader.show()
        this.dashboard_Service.getRssFeed()
            .subscribe(res => {
                this.loader.hide()
                const parser = new xml2js.Parser({ strict: false, trim: true });
                parser.parseString(res, (err, result) => {
                    let data: object[]
                    let size = 5

                    this.rssTitle = result.RSS.CHANNEL[0].TITLE
                    for (let i = 0; i <= 29; i++) {
                        if (result.RSS.CHANNEL[0].ITEM[i].CATEGORY == "Markets" || result.RSS.CHANNEL[0].ITEM[i].CATEGORY == "Business & Finance") {
                            data = result.RSS.CHANNEL[0].ITEM[i]
                            this.rssFilterData.push(data)
                        }
                    }
                    this.rssFilterData = this.rssFilterData.slice(0, size)
                    this.rssFilterData$.next(this.rssFilterData)
                })
            }, (error => {
                this.loader.hide()
                this.toast.error('Recent News Not Found', 'Error')
            }))
    }


}
