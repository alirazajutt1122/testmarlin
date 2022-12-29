export class StockPledgeReleaseDTO {
    exchange: String;
    security: String;
    client: String;
    type: String;
    date: Date;
    availableBalance: Number;
    quantity: Number;
    remarks: String;

    constructor() {
    }

}
export const StocknPledgeReleaseDTOList: StockPledgeReleaseDTO[] = [
    {
        "exchange": "GSE",
        "security": "ABL",
        "client": "140902000021",
        "type": "Deposit",
        "date": null,
        "availableBalance": 5000,
        "quantity": 200,
        "remarks": "Test"
    },
    {
        "exchange": "GSE",
        "security": "BOP",
        "client": "1409024001505",
        "type": "Withdraw",
        "date": null,
        "availableBalance": 15000,
        "quantity": 1200,
        "remarks": "Test"
    },
    {
        "exchange": "GSE",
        "security": "GOLC",
        "client": "140902000020",
        "type": "Withdraw",
        "date": null,
        "availableBalance": 25000,
        "quantity": 500,
        "remarks": "Test"
    }

];
