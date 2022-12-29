export class SecurityDailyIndicator {
    securityDailyIndicatorId: number;
    openPrice: number = 0;
    highPrice: number = 0;
    lowPrice: number = 0;
    closePrice: number = 0;
    exchangeId: number;
    exchangeCode: string = "";
    marketId: number;
    marketCode: string = "";
    exchangeMarketId: number;
    securityId: number;
    securityCode: string = "";
    securityName: string = "";
    averagePrice: number;
    changePrice: number;
    percentageChange: number;
    statsDate: Date;
    tradesCount: number;
    turnover: number;
    turnoverValue: number;
    varValue: number = 0;
    hhaRate: number = 0;
}