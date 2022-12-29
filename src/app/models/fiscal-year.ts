
import {AppConstants} from '../app.utility';
import {Participant} from './participant';

export class FiscalYear
{
    fiscalYearId:number=null;
    fiscalCode: string='';
    startDate: String;
    endDate: String;
    yearClosed: string; 
    status:string; 
    displayName_: string;

    participant:Participant = new Participant(); 

    constructor () {
        this.participant.participantId = AppConstants.participantId; 
    }
    
    public static getYearClosedStr(yearClosed):string {
        let yearClosedStr:string=''; 
        switch ( yearClosed) {
            case AppConstants.YEAR_CLOSED_CURRENT:
                yearClosedStr=AppConstants.YEAR_CLOSED_CURRENT_STR;
                break;
            case AppConstants.YEAR_CLOSED_TEMP:
                yearClosedStr=AppConstants.YEAR_CLOSED_TEMP_STR;
                break;
            case AppConstants.YEAR_CLOSED_PERMANENT:
                yearClosedStr=AppConstants.YEAR_CLOSED_PERMANENT_STR;
                break;
            case AppConstants.YEAR_CLOSED_NEW:
                yearClosedStr=AppConstants.YEAR_CLOSED_NEW_STR;
                break;
            default:
                yearClosedStr='';  
        }

        return yearClosedStr; 
    }
    public static getYearClosed(status):string {
        let yearClosed:string=''; 
        switch ( status) {
            case AppConstants.YEAR_CLOSED_CURRENT_STR:
                yearClosed=AppConstants.YEAR_CLOSED_CURRENT;
                break;
            case AppConstants.YEAR_CLOSED_TEMP_STR:
                yearClosed=AppConstants.YEAR_CLOSED_TEMP;
                break;
            case AppConstants.YEAR_CLOSED_PERMANENT_STR:
                yearClosed=AppConstants.YEAR_CLOSED_PERMANENT;
                break;
            case AppConstants.YEAR_CLOSED_NEW_STR:
                yearClosed=AppConstants.YEAR_CLOSED_NEW;
                break;
            default:
                yearClosed='';  
        }

        return yearClosed; 
    }
}