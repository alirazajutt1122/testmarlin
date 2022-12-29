import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { Router } from "@angular/router";
import { AppInjector } from "../../../../app.module";
import { NewsAdvertisementService } from '../../news_advertisements/news_advertisements.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DashboardService } from '../dashboard.service';
import * as xml2js from 'xml2js';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ListingService } from 'app/services/listing.service';


@Component({
    selector: 'dashboard-sidebar',
    templateUrl: './dashboard-sidebar.html',
    styleUrls: ['./dashboard-sidebar.scss'],
    styles: [
        `
            demo-sidebar fuse-vertical-navigation .fuse-vertical-navigation-wrapper {
                box-shadow: none !important;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardSidebar implements OnInit {
    menuDataBecomeInv: FuseNavigationItem[];
    menuDataViewDetail: FuseNavigationItem[];
    menuDataViewDetailParticipant : FuseNavigationItem[];
    naActiveDate: []
    rssData: string;
    userType: string;
    public investorProfileStatus : String = "";
    

    constructor(
        private news_advertisement_Service: NewsAdvertisementService,
        private dashboard_Service: DashboardService,
        private sanitizer: DomSanitizer,
        private loader : FuseLoaderScreenService,
        private listingService : ListingService) {

        this.menuDataBecomeInv = [
            {
                title: 'FAQs',
                type: 'basic',
                icon: 'heroicons_outline:plus-circle'
            },
            {
                title: 'Trading',
                type: 'basic',
                icon: 'heroicons_outline:user-group'
            },
            {
                title: 'Become an Investor',
                type: 'basic',
                icon: 'heroicons_outline:briefcase',
                function: function () {
                    const router = AppInjector.get(Router);
                    router.navigate(['/online-account-registration' , {action : 'user'}]);
                }
            },
        ];

        this.menuDataViewDetail = [
            {
                title: 'FAQs',
                type: 'basic',
                icon: 'heroicons_outline:plus-circle'
            },
            {
                title: 'Trading',
                type: 'basic',
                icon: 'heroicons_outline:user-group'
            },
            {
                title: 'View Investor details',
                type: 'basic',
                icon: 'heroicons_outline:briefcase',
                function: function () {
                    const router = AppInjector.get(Router);
                    router.navigate(['/online-account-registration' , {action : 'user'}]);
                }
            },
        ];

        this.menuDataViewDetailParticipant = [
            {
                title: 'FAQs',
                type: 'basic',
                icon: 'heroicons_outline:plus-circle'
            },
            {
                title: 'Trading',
                type: 'basic',
                icon: 'heroicons_outline:user-group'
            },
             
        ];

        this.userType = AppConstants.userType;


    }

    ngOnInit() {
        this.getNewsandAdvertisementData();
        this.getUserProfileStatus();
    }

    openLink(link) {
        window.open(link);
    }

    getNewsandAdvertisementData() {
        this.loader.show();
        this.news_advertisement_Service.getNewsandAdvertisements().subscribe((data) => {
            data?.sort((a, b) => b.naId - a.naId)
            this.naActiveDate = data;

            data?.forEach(ele => {
                if (ele.naImage != null) {
                    let objectURL = 'data:image/png;base64,' + ele.naImage;
                    ele.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                } else {
                    ele.src = ''
                }
            });
            this.loader.hide();
        });
    }



    public getUserProfileStatus = () => {
        this.listingService.getInvestorProfileStatus(AppConstants.userId).subscribe((restData:any)=>{
            if(!AppUtility.isEmptyArray(restData)) {
                 
                   this.investorProfileStatus = restData[0].statusCode;
             }
             else
             {
                this.investorProfileStatus = "";
             }
        }, error => {
               console.log(error);
        })
    }



}
