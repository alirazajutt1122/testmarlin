import { Provinces } from "./Province";

export class ContactDetail {

    taxNumber : String;
    trustee : String = "";
    contactPerson : String = "";
    registerationDate : Date;

    contactDetailId: Number;
    address1: String;
    address2: String;
    address3: String;
    cellNo: String;
    city: String;
    cityId: Number;
    companyName: String;
    countryId: Number;
    country: String;
    dob: Date;
    email: String;
    fatherHusbandName: String;
    firstName: String;
    gender: String;
    lastName: String;
    middleName: String;
    phone1: String;
    phone2: String;
    postalCode: String;
    registrationNo: String;
    state: String;
    title: String;
    webAddress: String;
    identificationTypeId: Number;
    identificationType: String;
    identificationTypeStr: String;
    industryId: Number;
    industry: String;
    professionId: Number;
    profession: String;
    fullName: String;
    idExpDate: Date;
    idIssueDate: Date;
    issuePlaceId: Number;
    zakat:String;
	cnicName:String;
	ntnNo:String;
	nomineeRelation:String;
    residenceStatus:Number;
    province: String;
    provinceId: Number;
    district: String;
    districtId: number;

    constructor() {
        this.dob = new Date();
        this.idExpDate = new Date();
        this.idIssueDate = new Date();
    }

}
