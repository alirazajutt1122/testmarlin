//import { Symbol } from './symbol';

export class SecurityType {
    securityTypeId: Number    
    securityType: String    
   // securities: Symbol;

    public populateData(data:SecurityType){
        this.securityTypeId=data.securityTypeId;
        this.securityType=data.securityType;
    }
}

/*export const SecurityTypeList: SecurityType[] = [
    {
        securityTypeId: null,        
        securityType: null,        
       // securities: null
    }

    
];*/