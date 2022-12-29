import { Registrar } from './registrar';
import { Sector } from './sector';
import { SecurityType} from './security-type';
import {SecurityFisDetail} from './security-fis-detail';
import {Country} from './country';
import { AssetClass } from './asset_class';
import { SecurityExchange } from './security_exchange';
import { ExchangeMarketSecurity } from './exch-mark-security';
import { AppConstants } from 'app/app.utility';

export class Security {

    etf : boolean = false;
    cfi : String = "";
    lei : String = "";
    fisn : String = "";

    securityId: Number;
    active: Boolean;
    isin: String="";
    securityCode:string=''; 
    securityName: String="";
    symbol: String="";
    faceValue:number=0.0001;
    outstandingShares:number=0;
    issuePrice:number=0.0001;
    registrar:Registrar;
    sector:Sector;
    securityType:SecurityType;
    securityFisDetail:SecurityFisDetail;
    countryBo:Country; 
    image:String
    imageName:String="";
    assetClass:AssetClass
    exchange:SecurityExchange    
    
    constructor() {
        this.securityType = new SecurityType(); 
        this.securityFisDetail = new SecurityFisDetail(); 
        this.countryBo = new Country(); 
    }
    public clear(){
        this.securityId = null;
        this.isin = "";
        this.securityName = "";
        this.active = true;

        this.symbol = "";
        this.faceValue = 0.0001;
        this.outstandingShares = 0;
        this.issuePrice = 0.0001;

        this.securityType = new SecurityType();
        this.securityType.securityTypeId = null;
        this.securityType.securityType = null;

        this.registrar = new Registrar();
        this.registrar.registrarId = null;
        this.registrar.name = null;

        this.sector = new Sector();
        this.sector.sectorId = AppConstants.BOND_SECTOR_ID;
        this.sector.sectorName = null;

        this.securityFisDetail = new SecurityFisDetail();

    }
}