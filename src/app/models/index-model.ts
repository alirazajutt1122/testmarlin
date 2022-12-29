export class Index {
    close: number;
    open: number;
    high: number;
    low: number;
    trades: number;
    value: number;
    volume: number;
    entryDatetime: Date;

    constructor() {
        this.close = 0;
        this.open = 0;
        this.high = 0;
        this.low = 0;
        this.trades = 0;
        this.value = 0;
        this.volume = 0;
        this.entryDatetime = new Date();
    }
}