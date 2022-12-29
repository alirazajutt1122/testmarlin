import { Security } from "./security";
import { Client } from "./client";
import { MmAuction } from "./mm-Auctions";

export class NewBid {
    bidId: number = null;
    mmAuction: MmAuction;
    security: Security;
    client: Client;
    clientInstruction: number = 0;
    clientInstruction_: string = "";
    amount: number = 0;
    discountRate: number = 0;
    faceValue: number = 0;
    status: boolean = true;
    isCancel: boolean = true;   //  it checks the auction date, if true (auction date hasn't passed yet) then enable relevant fields else disable
    interestRate: number = 0;
    reInvested: string = "N";
}