import { GLFamily } from './gl-family';
import { Participant } from './participant';
import {SecpAccount} from './secp-account';

export class ChartOfAccount {
	chartOfAccountId: Number;
	glCode: String = '';
	partialCode: String=''; 
	glDesc: String = '';
	headLevel: Number;
	leaf: Boolean;
	parentChartOfAccount:ChartOfAccount;
	parentChartOfAccountId: Number;
	parentGlCode: String = '';
	glCodeDisplayName_: String = ''
	parentGlDesc: String = '';
	glFamily: GLFamily;
	participant: Participant;
	ncb: String = '';
	lcb: String = '';
	dbsecondaryCode: String = '';
	crSecondaryCode: String = '';
	/*secpHead: String = '';*/
	dbSecpAccount: SecpAccount;
	crSecpAccount: SecpAccount;
}