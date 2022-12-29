import { Component, OnInit, ElementRef, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';





//imports for ngx translate
import { TranslateService } from '@ngx-translate/core';
import { UserTypes } from 'app/app.utility';
import { AppConstants, AppUtility } from 'app/app.utility';
import { NegotiatedDealsComponent } from 'app/modules/admin/oms/negotiation/negotiated-deals/negotiated-deals';
import { NewOrderAll } from 'app/modules/admin/oms/order/new-order-all/new-order-all';
import { RepoOrderComponent } from 'app/modules/admin/oms/repo/repo-order/repo-order';
import { AuthService2 } from 'app/services/auth2.service';
import { OrderService } from 'app/services/order.service';

declare var jQuery: any;

/////////////////////////////////////////////////////////////////////

@Component({
  selector: 'menubar',
  templateUrl: './menubar.html',
  styleUrls: ['./menubar.scss'],
})
export class Menubar implements OnInit {
  $el: any;
  topMenu: string = '';

  tickerSymbols: any[];
  claims: any;
  public userType = UserTypes;
  loggedInUserType: string;
  public isOrderNew: boolean = false;
  Deposit = "D"
  Withdraw = "W"
  Pledge = "P"
  Release = "R"
  publicMenu = true
  isParticipant = false


  @ViewChild(NewOrderAll, { static: false }) newOrderAllMenu: NewOrderAll;
  @ViewChild(NegotiatedDealsComponent, { static: false }) newNegotiatedOrderAllMenu: NegotiatedDealsComponent;
  @ViewChild(RepoOrderComponent, { static: false }) repoOrder: RepoOrderComponent;

  // --------------------------------------------------------------------

  constructor(el: ElementRef, public userService: AuthService2,
    private orderService: OrderService, private translate: TranslateService, public router : Router) {



    this.loggedInUserType = AppConstants.userType;

    this.$el = jQuery(el.nativeElement);
    this.claims = AppConstants.claims2;

    if (this.claims.user.userType == "MARLIN ADMIN") {
      this.publicMenu = false
    }
    if (this.claims.user.userType == "PARTICIPANT") {
      this.isParticipant = true
    }
    //for ngxtranslate
    let lang = localStorage.getItem("lang");
    if (lang == null) { lang = 'en' }
    this.translate.addLangs(['en', 'pt'])
    this.translate.use(lang)
  }

  // --------------------------------------------------------------------

  ngOnInit(): void {
    this.getTickerSymbols();

    this.userService.socket.on('symbol_stat', (symbolStat) => {
      AppUtility.printConsole('symbol_stat on menubar: ' + JSON.stringify(symbolStat));
      // ticker symbol list is populated based on exchange, so no need to compare the exchange
      for (let i = 0; i < this.tickerSymbols.length; i++) {
        let item = this.tickerSymbols[i];
        if (item.market === symbolStat.market &&
          item.symbol.toUpperCase() === symbolStat.symbol.toUpperCase()) {
          if (symbolStat.total_no_of_trades !== 0)  //  Imran bhai suggested that when market chages from pre-open to open,
          //  then symbol stats feed generates with 0 trade & price, to avoid that
          //  scenario check no. of trades @ 18/Apr/2017 - AiK
          {
            item.last_trade_price = symbolStat.close;
          }
          else {
            item.last_trade_price = symbolStat.last_day_close_price;
          }
          item.net_change = symbolStat.net_change;
        }
      }
    });



  }

  // --------------------------------------------------------------------




// public routeInvestorRequests=()=>{
//   this.router.navigate(['/dashboard/patient-details', { action : "" }]);
// }




  topMenuClicked(menuName) {
    this.topMenu = menuName;

  }

  // --------------------------------------------------------------------

  getTickerSymbols() {
    this.tickerSymbols = [];
    this.orderService.getTickerSymbols(AppConstants.TICKER_EXCHANGE).subscribe(
      data => {
        if (!AppUtility.isValidVariable(data)) {
          return;
        }
        if (data.length > 0) {
          this.tickerSymbols = JSON.parse(data._body);
          for (let i = 0; i < this.tickerSymbols.length; i++) {
            this.userService.socket.emit('symbol_sub',
              {
                'exchange': AppConstants.TICKER_EXCHANGE,
                'market': this.tickerSymbols[i].market,
                'symbol': this.tickerSymbols[i].symbol
              });
          }
        }
      },
      error => { });
  }
}
