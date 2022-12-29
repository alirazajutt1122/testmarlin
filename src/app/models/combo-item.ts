export class ComboItem {

    label:string; 
    value:string;
    displayName_:string; 
 
    constructor (label_:string, value_:string) {
        this.label = label_; 
        this.value = value_; 
        this.displayName_=label_; 
    } 
}