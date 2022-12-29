export class Privilege {
    privilegeId: Number;
	optionName:String="";
	hasChild:Boolean;
    allowed:Boolean;
    childs:Privilege[];
    
    constructor(){
        this.privilegeId = null;
        this.optionName="";
        this.hasChild=false;
        this.allowed=false;
        this.childs=[];
    }
	 
}