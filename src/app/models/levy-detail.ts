import { ClientLevieMaster } from './client-levy-master';
import { TraansactionTypesExchange } from './traansaction-type-exchange';

export class LevieDetail {
    leviesDetailId: Number;
	levyRate: Number;	
    tradingSide:String='';
	tradingSideDisplay_:String='';
	effectiveDate: Date;
	active: Boolean;
	leviesMaster: ClientLevieMaster;   
	traansactionTypesExchange: TraansactionTypesExchange;
	unProcessedLevy:Number;

	level:String='';
	name:String='';
	recurrence:String='';
	effectiveToDate: Date;
}