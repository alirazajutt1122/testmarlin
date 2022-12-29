import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PortfolioComponent } from './portfolio.component';
import { PortfolioRoutingModule } from './portfolio.routing';
import { OrderNewModule } from '../oms/order/order.module';
import { ActualPortfolioComponent } from './actual-portfolio.component';
import { TranslateModule } from '@ngx-translate/core';
import { WjChartModule } from '@grapecity/wijmo.angular2.chart';
import { WjChartAnimationModule } from '@grapecity/wijmo.angular2.chart.animation';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
@NgModule({
    declarations: [
        PortfolioComponent,
        ActualPortfolioComponent
    ],
    imports: [
        RouterModule.forChild(PortfolioRoutingModule),
        WjInputModule,
        CommonModule,
        HttpClientModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        OrderNewModule,
        TranslateModule,
        WjChartModule,
        WjChartAnimationModule,
        WjCoreModule,
        WjGridFilterModule,
        WjGridModule,
    ],
    exports: [
        PortfolioComponent
    ],
    providers : [
        DatePipe
    ]
})
export class PortfolioModule {
}