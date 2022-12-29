import { Privilege } from './privilege';

export class RolePrivilege {
    roleId: Number;
	privileges:Privilege[];
    
    constructor(){
        this.roleId = null;
        this.privileges=[];
    }
	 
}