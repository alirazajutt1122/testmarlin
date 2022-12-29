export class Custodian {
    participantId: number = 0;
    participantCode: string = '';
    participantName: string = '';

    constructor(id: number = 0, code: string = '') {
        this.participantId = id;
        this.participantCode = code;
    }
}
