import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FavouritesComponent } from './favourites.component';
import { RouterModule } from '@angular/router';
import { FavouritesRoutingModule } from './favourites.routing';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [
        FavouritesComponent
    ],
    imports: [
        RouterModule.forChild(FavouritesRoutingModule),
        CommonModule,
        HttpClientModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
    ],
    exports: [
        FavouritesComponent
    ]
})
export class FavouritesModule {
}