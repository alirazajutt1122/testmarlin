import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from "rxjs";
import { FuseMediaWatcherService } from "../../../../@fuse/services/media-watcher";
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsAdvertisementService } from './news_advertisements.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { AddNewsAndAdvertisementComponent } from './add-news-and-advertisement/add-news-and-advertisement.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';



@Component({
    selector: 'news&advertisements',
    templateUrl: './news_advertisements.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewsAdvertisementsPage implements OnInit, AfterViewInit {

    recentNA_TableColumns: string[] = ['Type', 'Title', 'Details', 'AssetClass', 'EntryDate', 'ExpiryDate', 'Weblink', 'Active', 'Image'];
    recentNADataSource: MatTableDataSource<any> = new MatTableDataSource();
    panelOpenState = false;
    // @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(private _fb: FormBuilder,
        private na_Service: NewsAdvertisementService,
        private _matDialog: MatDialog,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit(): void {
        this.getNewsandAdvertisementData()

    }
    ngAfterViewInit(): void {
        // this.recentNADataSource.paginator = this.paginator;

    }

    getNewsandAdvertisementData() {
        this.na_Service.getNewsandAdvertisements().subscribe((data) => {
            data?.forEach(ele => {
                if (ele.naImage != null) {
                    let objectURL = 'data:image/png;base64,' + ele.naImage;
                    ele.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                } else {
                    ele.src = ''
                }
            });
            this.recentNADataSource.data = data;
        });
    }

    onClickAddNewsAndAdvertisement() {
        this._matDialog.open(AddNewsAndAdvertisementComponent, {
            autoFocus: false,
            position: { top: '5%' },
        }).afterClosed().subscribe((data) => {
            console.log(data)
            if (data?.naType != null) {

                if (data?.tempImg != null) {
                    let objectURL = 'data:image/png;base64,' + data?.tempImg;
                    data.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                }
                this.recentNADataSource.data.unshift(data);
                this.recentNADataSource._updateChangeSubscription();
            }
        })

    }

}