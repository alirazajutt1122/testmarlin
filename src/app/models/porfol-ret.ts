import { Participant } from './participant';
import { InstrumentModel } from './instrument';

export class PortfolioReturnModel {
    portfolioReturnId: number = 0;
    yearEnd: Date;
    period: string = '';
    roiPercentage: number = 0.01;
    instrument: InstrumentModel;
    participant: Participant;

    //  fields for display purposes
    yearEndDisplay_: string = '';
    monthDisplay_: string = '';
    yearDisplay_: string = '';
    periodDisplay_: string = '';
}
