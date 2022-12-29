export class PhysicalStockEntryDTO {
    folioNumber:String;
    certificateFrom:Number;
    quantity:Number;
    certificateTo:Number;
    action:String;
    status:Boolean;
     constructor(){
     }

}
export const PhysicalStockEntryList: PhysicalStockEntryDTO[] =[
    { 
      "folioNumber":"40902000021",
      "certificateFrom":150,
      "quantity":50,
      "certificateTo":199,      
      "action":null,
      "status":false
    },
    { 
       "folioNumber":"1090203022",
      "certificateFrom":250,
      "quantity":100,
      "certificateTo":349,      
      "action":null,
      "status":false
    },
    {       
       "folioNumber":"5402687498",
      "certificateFrom":50,
      "quantity":5,
      "certificateTo":54,      
      "action":null,
      "status":false
    }
    ];
