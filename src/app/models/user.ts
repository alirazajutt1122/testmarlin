import { Country } from './country';
import { Participant } from './participant';
import { Role } from './role';
export class User {
  userId: Number;
  email: String = "";
  password: String = "";
  status: String = "";
  active: Boolean;
  defaultUser : Boolean;
  lookupId: Number;
  userTypeId: Number;
  userStateId: Number;
  userType: String = "";
  userName: String = "";
  userState: String = '';
  participant: Participant;
  roles: Role[];
  dashboard: string = '';
  roleNamesDisplay_: String;
  country:Country
  exchangeId: number  ; 

  constructor() {
    this.participant = new Participant();
    this.country = new Country
    this.roles = [];
  }
}