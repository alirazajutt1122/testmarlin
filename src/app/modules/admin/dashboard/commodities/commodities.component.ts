import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

export interface Commodities {
    name: string;
    background: string;
}

@Component({
    selector: 'commodities',
    templateUrl: './commodities.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommoditiesComponent implements OnInit {

    commoditiesCard: Commodities[] = [{
        name: 'Currencies',
        background: 'assets/images/marlin-dashboard/commodities/currencies.jpg'
    }, {
        name: 'Equities',
        background: 'assets/images/marlin-dashboard/equity.jpg'
    }, {
        name: 'Hydrocarbons',
        background: 'assets/images/marlin-dashboard/hydrocarbon.jpg'
    }, {
        name: 'Metals',
        background: 'assets/images/marlin-dashboard/world.png'
    },]

    constructor() {
    }

    ngOnInit(): void {
    }

}
