import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
 
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
 
import { PortfolioService } from './portfolio.service';
 
 
import { fuseAnimations } from "../../../../@fuse/animations";
 
import { AppState } from 'app/app.service';
import { AuthService } from 'app/core/auth/auth.service';
import { FormBuilder } from '@angular/forms';
 
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';
import * as wijmo from '@grapecity/wijmo';
import * as chart from '@grapecity/wijmo.chart';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { CollectionView, SortDescription,IPagedCollectionView,} from '@grapecity/wijmo';
import { AppConstants, AppUtility } from 'app/app.utility';
import { BehaviorSubject } from 'rxjs';
import { ListingService } from 'app/services/listing.service';
import { DialogCmp } from '../back-office/user-site/dialog/dialog.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'actual-portfolio',
    templateUrl: './actual-portfolio.component.html',
    styleUrls: ['./actual-portfolio.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ActualPortfolioComponent implements OnInit {

    equityBarPercent = new BehaviorSubject<String>("15%");
    equityColor: String = AppConstants.equityColor
    equityPLColor: String = "#FFFFFF"
  
    bondsBarPercent = new BehaviorSubject<String>("35%");
    bondsColor: String = AppConstants.bondsColor
    bondsPLColor: String = "#FFFFFF"
  
    etfBarPercent = new BehaviorSubject<String>("50%");
    etfColor: String = AppConstants.etfColor
    etfPLColor: String = "#FFFFFF"
  
 
    loading : boolean = false;
    NoDataFound : boolean = false;

    lang: any
    Wjdata: any[];
    equitiesGraph: number = 10
    bondsGraph: number = 5
    etfGraph : number = 2;
    _pageSize = 0;
    public selectedTab : string = AppConstants.ASSET_CLASS_EQUITIES;
    menu: string[] = ['Name', 'Volume', 'AveragePrice', 'CurrentPrice', 'MarketValue', 'DayP/L', 'TotalP/L', 'LastPurchaseDate', 'BuySell'];
    portfolioDetailDataSource: MatTableDataSource<any> = new MatTableDataSource();
    itemsList: wjcCore.CollectionView;
    public portfolioWeight : string = "PORTFOLIO WEIGHT";

    @ViewChild('flex',{ static: false }) flex: wjcGrid.FlexGrid;
    // @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    errorMessage: any;
    equitiesPortfolioSum: any;
    bondsPortfolioSum: any;
    etfPortfolioSum: any;

    constructor(
        private _portfolioService: PortfolioService,
        private sanitizer: DomSanitizer,
        private appState: AppState, public authServiceOMS: AuthService,  
        private listingSvc: ListingService, private _fb: FormBuilder, private translate: TranslateService, private splash: FuseLoaderScreenService, 
        private toast: ToastrService, private datePipe: DatePipe
    ) {
          //_______________________________for ngx_translate_________________________________________

          this.lang = localStorage.getItem("lang");
          if (this.lang == null) { this.lang = 'en' }
          this.translate.use(this.lang)
          //______________________________for ngx_translate__________________________________________
    }

    ngOnInit(): void {
        this.Wjdata = this.getData();
        if(this.lang == 'pt') {
            this.portfolioWeight = "PESO DA CARTEIRA";
        }

       this.getActualPortfolioSummary();
       this.getActualPortfolioDetail(AppConstants.ASSET_CLASS_ID_EQUITIES);

    }
 


    // --------------------------------------------------------------------------------

    get pageSize(): number {
        return this._pageSize;
      }
    
      set pageSize(value: number) {
        if (this._pageSize != value) {
          this._pageSize = value;
          if (this.flex) {
            (<IPagedCollectionView><unknown>this.flex.collectionView).pageSize = value;
          }
        }
      }
    
    // --------------------------------------------------------------------------------






   public getActualPortfolioSummary = () => {
    debugger
    this.splash.show();
    this.equitiesPortfolioSum = null;
    this.bondsPortfolioSum = null;
    this.etfPortfolioSum = null;
    this.listingSvc.getActualPortfolioSummary(AppConstants.userId).subscribe((restData : any) => {
                 this.splash.hide();
                 if(!AppUtility.isEmptyArray(restData)){
                       restData.forEach(element => {
                            if(element.assetClass.assetId === AppConstants.ASSET_CLASS_ID_EQUITIES) {
                                  this.equitiesPortfolioSum = element;
                            }
                            else if(element.assetClass.assetId === AppConstants.ASSET_CLASS_ID_BONDS) {
                                this.bondsPortfolioSum = element;
                          }
                          else if(element.assetClass.assetId === AppConstants.ASSET_CLASS_ID_ETFS) {
                            this.etfPortfolioSum = element;
                          }
                       })
                 }

    }, error => {
             this.splash.hide();
             if(error.message){
                this.errorMessage = <any>error.message;
              }
              else
              {
                this.errorMessage = <any>error;
              }
            
    });
   }




   public getActualPortfolioDetail = (assetId) => {
    this.splash.show();
    this.portfolioDetailDataSource.data = [];
    var date = new Date();
    let transDate = this.datePipe.transform(date,"yyyy-MM-dd");
    this.listingSvc.getActualPortfolioDetail(assetId , AppConstants.userId, transDate).subscribe((restData : any) => {
                 this.splash.hide();
                 if(restData.length > 5){
                    restData.length = 5;
                 }
                 this.portfolioDetailDataSource.data = restData;
                 debugger

    }, error => {
             this.splash.hide();
             if(error.message){
                this.errorMessage = <any>error.message;
              }
              else
              {
                this.errorMessage = <any>error;
              }
             
    });
   }









public onChangeTab = (tabName : string) => {
     if(tabName === AppConstants.ASSET_CLASS_EQUITIES){
        this.selectedTab = AppConstants.ASSET_CLASS_EQUITIES;
        this.getActualPortfolioDetail(AppConstants.ASSET_CLASS_ID_EQUITIES);
     }
     else if(tabName === AppConstants.ASSET_CLASS_BONDS){
        this.selectedTab = AppConstants.ASSET_CLASS_BONDS;
        this.getActualPortfolioDetail(AppConstants.ASSET_CLASS_ID_BONDS);
     }
     else if(tabName === AppConstants.ASSET_CLASS_ETF){
        this.selectedTab = AppConstants.ASSET_CLASS_ETF;
        this.getActualPortfolioDetail(AppConstants.ASSET_CLASS_ID_ETFS);
     }
}





    getData() {
        return [
            { type: 'EQUITIES', trade: this.equitiesGraph },
            { type: 'BONDS', trade: this.bondsGraph },
            { type: 'ETFs', trade: this.etfGraph }
        ];
    }



    
    getLabelContent = (ht: chart.HitTestInfo) => {
       return wijmo.format('{name} {val}', { val: ht.value });
    }






    public getNotification(btnClicked) {
        
      }







}