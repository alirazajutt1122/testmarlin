import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConstants } from 'app/app.utility';
import { SymbolAddDialogComponentService } from 'app/modules/common-components/symbol-add-dialog/symbol-add-dialog.component.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';



@Component({
    selector: 'favourites',
    templateUrl: './favourites.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})

export class FavouritesComponent implements OnInit {

    // watchlistSymbols = new BehaviorSubject<any>("");
    userid: Number;
    favouriteSymbolsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    menu: string[] = ['Symbol', 'Bid', 'Ask', 'Change', 'Favourites'];

    constructor(
        private _symbolService: SymbolAddDialogComponentService,
        private toast: ToastrService,
        private sanitizer: DomSanitizer,
        private _router: Router,
    ) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userid = user.id;
    }

    ngOnInit(): void {
        this.getWatchListSymbols()
    }

    removeFromWatchList(element: any) {
        this.deleteFromWatchList(this.userid, element)
    }

    onClickInfo(element) {
        this._router.navigate([`/trading-portal/trading-graph/${element.exchangeCode}/${element.marketCode}/${element.securityCode}`])
    }

    getWatchListSymbols() {
        this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((data) => {
            data.map(a => {
                let objectURL = 'data:image/png;base64,' + a.securityImage;
                a.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                a.bidPrice = a.bestMarketDTO[0].bidPrice
                a.offerPrice = a.bestMarketDTO[0].offerPrice
                a.dir = a.securityStatsDTO[0]?.change.startsWith('-') ? 'down' : a.dir = 'up';
                a.securityStatsDTO.change = a.securityStatsDTO[0]?.change
            });
            
            this.favouriteSymbolsDataSource.data = data
            console.log(data[0].index)
        }, (error => {
            this.toast.error('Something Went Wrong', 'Error')
        }));
    }

    deleteFromWatchList(userid: Number, element: any) {
        let symbolid = element?.id

            this._symbolService.deleteFavourite(userid, symbolid).subscribe(() => {
                let index = this.favouriteSymbolsDataSource.data.indexOf(element)
                let numberOfElementToRemove = 1;
                if (index !== -1) { this.favouriteSymbolsDataSource.data.splice(index, numberOfElementToRemove) }
              
                this.favouriteSymbolsDataSource._updateChangeSubscription();
                this.toast.success('Symbol Removed from Favourite List')
            }, (error => {
                this.toast.error('Something Went Wrong', 'Error')
            })); 
    }


}