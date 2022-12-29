import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFullscreenModule } from '@fuse/components/fullscreen/fullscreen.module';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { SearchModule } from 'app/layout/common/search/search.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { SharedModule } from 'app/shared/shared.module';
import { ClassyLayoutComponent } from 'app/layout/layouts/classy/classy.component';
import { FuseCardModule } from "../../../../@fuse/components/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UiSwitchModule } from 'ngx-ui-switch';
import { Menubar } from './menubar/menubar';
import { OrderNewModule } from 'app/modules/admin/oms/order/order.module';
import { TranslateModule } from '@ngx-translate/core';
import { TradingReportsModule } from 'app/modules/admin/oms/reports/reports.module';
import { MessagesAlertsAnnouncements } from './Message-Alerts-Announcements/Messages-Alerts-Announce';
import { NotificationLoad } from './notifications/notification-load.directive';
import { Notifications } from './notifications/notifications.component';
import { MarketWatchDashboardModule } from 'app/modules/admin/dashboard/market-watch-dashboard/market-watch-dashboard.module';
import { NegotiationModule } from 'app/modules/admin/oms/negotiation/negotiation.module';
import { RepoModule } from 'app/modules/admin/oms/repo/repo.module';
import { QuoteModule } from 'app/modules/admin/oms/quote/quote.module';





@NgModule({
    declarations: [
        ClassyLayoutComponent,
        Menubar,
        MessagesAlertsAnnouncements,
        NotificationLoad,
        Notifications
    ],
    imports: [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        FuseFullscreenModule,
        FuseNavigationModule,
        LanguagesModule,
        SearchModule,
        UserModule,
        SharedModule,
        FuseCardModule,
        MatTooltipModule,
        OrderNewModule,
        NegotiationModule,
        TranslateModule,
        TradingReportsModule,
        MarketWatchDashboardModule,
        RepoModule,
        QuoteModule,
        UiSwitchModule.forRoot({
            size: 'small',
            color: 'rgb(0, 189, 99)',
            defaultBgColor: '#476EFF',
            defaultBoColor: '#00ACFF',
            checkedLabel: 'Actual Trade',
            uncheckedLabel: 'Virtual Trade'
        })
    ],
    exports: [
        ClassyLayoutComponent
    ]
})
export class ClassyLayoutModule {
}
