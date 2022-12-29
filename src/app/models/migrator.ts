export class Migrator {
  participantId: number = 0;
  requestFileBase64: string = '';
  responseFileBase64: string = '';
  serverResponse: string = '';
  loadedRecords: number = 0;
  openTradeRecords: number= 0;
	fullReleaseRecords: number= 0;
	multiReleaseRecords: number= 0;
	partialReleaseRecords: number= 0;
  rollOverRecords: number= 0;
  errorRecords: number = 0;
  existingRecords: number = 0;
  transactionType: string = '';
  exchange: number = 0;
  date: Date ;
}
