import { InvestorDividendDetail } from "./investor-dividend-details";
import { InvestorDocumentDepo } from "./investor-document-depo";
import { InvestorJointAccountDetail } from "./investor-joint-account";
import { InvestorSuccessorAccountDetail } from "./investor-successor-detail";

export class InvestorRegistrationDepositry {
    
    REF_No : String = "";
    Account_Id : Number = null;
    Account_Code : String = "";
    Is_Political_Person : String = '';
    Opening_Date : Date = new Date();
    Name : String =  "";
    contactPerson : String  = "";
    Participant_Code : String  =  "";
    Acc_Type_Id : Number =  null;
    Industury_Code : String = "";
    Occupation_Code : String = "";
    Identification_Number : String  = "";
    Identification_Type_Id : Number = null;
    Residence_Status_Id  : Number  =  null;
    Address1 : String  =  "";
    Address2  : String = "";
    City_Name : String = "";
    Country_Name : String = "";
    Telephone1  : String =  "";
    fax  : String  =  "";
    Email  : String =  "";
    webAddress : String =  "";
    Mobile  : String =  "";
    TaxNumber : String  =  "";
//    Status_Id  : Number  =  null;
    isProprietary  : Number  =  0;
    Postal_Code : String = "";
    AccountType : Number = null;
    Is_Tax_Number_Valid : Number = null;
    IS_TAX_EXMP : Number = null;
    // Bulk_flag : Number = null;
    // Created_by : String = "";
    // active : String =  "";
    // itf  : String =  "";
    CASH_SETTLEMENT_AGENT_ID  : Number = null;
    SECURITY_SETTLEMENT_AGENT_ID : Number = null;
    
    AccountDividendDetail : InvestorDividendDetail;
    SuccessorAccountDetails : InvestorSuccessorAccountDetail[];
    JointAccountDetails : InvestorJointAccountDetail[];
    AccountDocumentModels : InvestorDocumentDepo[];


    constructor() {
    
    }

}



