export class VaultDetail {
    client:String;
    clientName:String;
    security:String;    
    type:String;   
    quantity:Number;
    remarks:String;
    status:Boolean;
    
     constructor(){
     }

}
export const VaultDetailList: VaultDetail[] =[
    { 
      "client":"140902000021",
      "clientName":"SUTHERLAND BRUCE",
      "security":"ABL",      
      "type":"Deposit",      
      "quantity":500,
      "remarks":"",
      "status":false
    },
    { 
      "client":"1409024001505",
      "clientName":"ROSSI GIANNI",
      "security":"BOP",      
      "type":"Withdraw",     
      "quantity":1800,
      "remarks":"",
      "status":false
    },
    {       
      "client":"140902000020",
      "clientName":"MATEMBA NOEL",
      "security":"GOLC",
      "type":"Pledge",      
      "quantity":150,
      "remarks":"",
      "status":false
    },
     { 
      "client":"140902000001",
      "clientName":"FBC Pension Fund",
      "security":"TSL",      
      "type":"Release",     
      "quantity":800,
      "remarks":"",
      "status":false
    }
    ];
