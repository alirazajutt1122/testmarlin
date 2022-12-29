import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";

import {DomSanitizer} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'watch-oms',
    templateUrl: './watch.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WatchOmsComponent  {





}
