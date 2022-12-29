import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {FuseCardModule} from "../../../../../@fuse/components/card";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";

import {HttpClientModule} from '@angular/common/http';
import {TranslocoRootModule} from 'app/transloco/transloco-root.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { RecentNewsComponent } from './recent-news.component';




@NgModule({
    declarations: [
        RecentNewsComponent
    ],
    imports: [
        CommonModule,
        FuseCardModule,
        MatInputModule,
        MatTableModule,
        HttpClientModule,
        TranslocoRootModule,
        MatAutocompleteModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        FormsModule,
        ReactiveFormsModule,
        SocketIoModule,
        TranslocoRootModule,
        LanguagesModule
        

    ],
     exports: [
        RecentNewsComponent
    ]
})
export class RecentNewsModule {
}
