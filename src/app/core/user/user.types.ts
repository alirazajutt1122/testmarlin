export interface User {
    id: string;
    name: string;
    email: string;
    mobileNumber: string; 
    avatar?: string;
    status?: string;
    userId: number;
    password: string;
    userStatus: null;
    country: Country;
    token: string;
    exchangeId: number; 
}

export interface Country {
    countryId: number;
    countryCode: string;
    countryName: string;
    dialingCode: string;
}

export interface BackOfficeUser {
    email: string;
    productId: number;
    productUserName: string;
    productUserPasscode: string;
    subscriptionId: number;
    userId: number;
}
