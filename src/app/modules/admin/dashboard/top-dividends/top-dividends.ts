import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

export interface Commodities {
    name: string;
    background: string;
}

@Component({
    selector: 'top-dividends',
    templateUrl: './top-dividends.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TopDividendComponent implements OnInit {

    recentTransactionsDataSourceForTopDividends: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumnsForDividends: string[] = ['date', 'name'];
    topDividends = [
        {
            symbol: 'CNEROY',
            price: 6.78,
        },
        {
            symbol: 'TELE',
            price: 16.18,
        },
        {
            symbol: 'WTL',
            price: 2.13,
        },
        {
            symbol: 'TRO',
            price: 123.19,
        },
        {
            symbol: 'PRL',
            price: 14.65,
        },
    ];

    constructor(

    ) { }

    ngOnInit(): void {
        this.recentTransactionsDataSourceForTopDividends.data = this.topDividends;
    }

}
