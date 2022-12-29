export class BondSubCategory {
    subCategoryId:number;
    subCategory:string="";
    subCategoryDesc:string="";

    public clear(){
        this.subCategoryId=0;
        this.subCategory=null;
        this.subCategoryDesc=null;
    }

    constructor(id: number = 0, subCategory: string = '', desc: string = '') {
        this.subCategoryId = id;
        this.subCategory = subCategory;
        this.subCategoryDesc = desc;
    }
    
}