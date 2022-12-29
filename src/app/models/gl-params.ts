import { Participant } from './participant';
import { ChartOfAccount } from './chart-of-account';

export class GLParams {
	glParamId: Number;
	vouNoReinitialize: String = "";
	backdateEntry: Boolean;
	coaLevels: Number;

	participant: Participant;
	chartOfAccount: ChartOfAccount;
}