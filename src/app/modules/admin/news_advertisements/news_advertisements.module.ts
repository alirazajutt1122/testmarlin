import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsAdvertisementsPage } from './news_advertisements.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { NewsAdvertisementsRouting } from "./news_advertisements.routing";
import { MatButtonModule } from "@angular/material/button";
import { FuseLoadingBarModule } from "../../../../@fuse/components/loading-bar";
import { FuseCardModule } from "../../../../@fuse/components/card";
import { ReactiveFormsModule } from '@angular/forms';

import { FuseAlertModule } from "../../../../@fuse/components/alert";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms';
// import { DialogCmp } from './user-site/dialog/dialog.component';
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddNewsAndAdvertisementComponent } from './add-news-and-advertisement/add-news-and-advertisement.component';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
    declarations: [
        NewsAdvertisementsPage,
        AddNewsAndAdvertisementComponent
    ],
    imports: [
        RouterModule.forChild(NewsAdvertisementsRouting),
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        FuseLoadingBarModule,
        FuseCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        FuseAlertModule,
        MatDatepickerModule,
        MatMomentDateModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatPaginatorModule
    ]
})
export class NewsAdvertisementsModule {
}