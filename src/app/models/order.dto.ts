export class Order {

    public TIF:Date;
    public TIF_OPTIONS:String="";
    public IS_SHORT:Boolean;
    public SIDE:String="";
    public REF_NO:String="";
    public TRIGGER_PRICE:Number=0; //Explicitly set to zero, as it has impact in case of quick orders
    public TRIGGER_PRICE_STR:String=""; 
    public TRAILING_STOPLOSS_DIP:Number=-1;
    
    public TYPE:String="normal";
    public PRICE_TYPE:String="";

    public ENTRY_DATETIME:Date;
    public PRICE:Number=-1;
    public PRICE_STR:String="";
    public PREVIOUS_PRICE:Number=0;
    public VOLUME:Number=-1;
    public PREVIOUS_VOLUME:Number=0;

    public DISCLOSED_VOLUME:Number=0;

    public USER_ID:Number=-1;
    public USER:String="";
    public SENDER_USER_ID:Number=-1;
    public CLIENT_ID:Number=-1;
    public ORDER_NO:Number=0;

    //from business_objects.Order
    public EXCHANGE_ID:Number=-1;
    public MARKET_ID:Number=-1;
    public SYMBOL_ID:Number=-1;

    public INTERNAL_EXCHANGE_ID:Number=-1;
    public INTERNAL_MARKET_ID:Number=-1;
    public INTERNAL_SYMBOL_ID:Number=-1;

    public EXCHANGE_CODE:String="";
    public MARKET_CODE:String="";
    //only used for oder submission from client end where symbol id is unknown
    public SYMBOL:String="";

    public PUBLIC_ORDER_STATE:String="";
    public PRIVATE_ORDER_STATE:String="";

    public CLIENT_CODE:String="";
    public BROKER_ID:Number=-1;

    //Targetted trade:
    public BROKER_CODE:String="";
    public COUNTER_BROKER_CODE:String="";
    public USER_NAME:String="";

    public COUNTER_CLIENT_CODE:String="";
    public COUNTER_BROKER_ID:Number=-1;
    public COUNTER_USER_ID:Number=-1;
    public COUNTER_CLIENT_ID:Number=-1;
    public NEGOTIATED_ORDER_STATE:String="";
    public COUNTER_USER_NAME:String="";
    public COUNTER_ORDER_NO:Number=-1;
    public IS_NEGOTIATED:Boolean;
    public ORDER_CONDITION:String="NONE";

    //only used at view
    public REMAINING:Number=0;
    
    public SELECTED:Boolean=false;
    public IS_ORDER_NO_SWAPPED:Boolean=false;
    
    public ORDER_TYPE:String="";
    public ORDER_QUALIFIER:String="";
    public QUALIFIER_QUANTITY:String="";
    public GOOD_TILL_DATE:Date;
    public ORDER_INITIATOR:String="";
    public EXCHANGE:String="";
    public MARKET:String="";
    
    public ODD_LOT_VOLUME:Number=-1; 
    
    public QUOTE_ID:Number=0; // this will be applied in case of quote order and initiated on server side  
        
    public precision:Number = 0 ;
    
    public CUSTODIAN_ID:Number=0; 
    public CUSTODIAN_CODE:String=""; 
    
    public COUNTER_CUSTODIAN_ID:Number=0; 
    public COUNTER_CUSTODIAN_CODE:String="";
    
    public ODD_VALIDATION:Boolean=false; // used for split validation flag
    
    public ORIGINATOR_APPLICATION:String=""; // for EAC 
    public ORIGINAL_REF_NO:String="";  // for EAC 

}