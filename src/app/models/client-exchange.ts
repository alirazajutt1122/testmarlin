export class ClientExchange{
    clientExchangeId:Number;
	active:Boolean;
	allowShortSell:Boolean;
	bypassCrs:Boolean;
	margin:Number;
	openPositionStatus:Boolean;
    clientId:Number;
    exchangeId:Number;
    exchangeName:String;
    participantExchangeId:Number;

    constructor(){
        this.clientExchangeId=null;
        this.active=false;
        this.allowShortSell=false;
        this.bypassCrs=false;
        this.margin=0.01;
        this.openPositionStatus=false;
        this.clientId=null;
        this.exchangeId=null;
        this.exchangeName="";
        this.participantExchangeId=null;
    }
}