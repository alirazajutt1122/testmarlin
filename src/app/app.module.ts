import {CUSTOM_ELEMENTS_SCHEMA, Injector, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ExtraOptions, PreloadAllModules, RouterModule} from '@angular/router';
import {MarkdownModule} from 'ngx-markdown';
import {FuseModule} from '@fuse';
import {FuseConfigModule} from '@fuse/services/config';
import {FuseMockApiModule} from '@fuse/lib/mock-api';
import {CoreModule} from 'app/core/core.module';
import {appConfig} from 'app/core/config/app.config';
import {mockApiServices} from 'app/mock-api';
import {LayoutModule} from 'app/layout/layout.module';
import {AppComponent} from 'app/app.component';
import {appRoutes} from 'app/app.routing';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from "../environments/environment";
import {ToastrModule} from "ngx-toastr";
import {HttpClientModule} from '@angular/common/http';
import {TranslocoRootModule} from "./transloco/transloco-root.module";
import {MatDialogModule, MatDialogRef,MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SymbolAddDialogComponent} from "./modules/common-components/symbol-add-dialog/symbol-add-dialog.component";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {SharedModule} from "./shared/shared.module";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from "@angular/material/table";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PortfolioDetailComponent} from "./modules/common-components/portfolio-detail/portfolio-detail.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ListingService } from './services-oms/listing-oms.service';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DashboardModule } from './modules/admin/dashboard/dashboard.module';
import { AppConfig } from './app.config';
import { AppConstants } from './app.utility';



const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

const config: SocketIoConfig = {
    url: environment.socketUrl,
    options: {
        transports: ['websocket']
    }
}

@NgModule({
    declarations: [
        AppComponent,
        SymbolAddDialogComponent,
        PortfolioDetailComponent
    ],
    imports: [
        SocketIoModule.forRoot(config),
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        CoreModule,
        LayoutModule,
        MarkdownModule.forRoot({}),
        ToastrModule.forRoot({timeOut: 1200}),
        HttpClientModule,
        TranslocoRootModule,
        MatDialogModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule ,
        MatSelectModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgApexchartsModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        NoopAnimationsModule,


    ],

    bootstrap: [
        AppComponent
    ],
    exports: [TranslocoRootModule],
    entryComponents: [SymbolAddDialogComponent],
    providers: [
    //    {provide: LOCALE_ID, useValue : 'en_PK' },
      MatDatepickerModule,
      AppConfig,
      DatePipe,
      {
        provide: MatDialogRef,
        useValue: {}
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {}
      },
      {
        provide : LocationStrategy,
        useClass : HashLocationStrategy
      }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
    constructor(private injector: Injector) {
        AppInjector = this.injector;
    }
}

export let AppInjector: Injector;
