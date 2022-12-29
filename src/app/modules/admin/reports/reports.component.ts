import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import {FuseMediaWatcherService} from "../../../../@fuse/services/media-watcher";

import {DomSanitizer} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'reports',
    templateUrl: './reports.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit, OnDestroy {
 

    constructor(
          ) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
       
    }

}
