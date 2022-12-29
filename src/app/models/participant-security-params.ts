import { Exchange } from './exchange';
import { Market } from './market';
import { Security } from './security';

export class ParticipantSecurityParams {
    participantSecurityParamsId: number;
    haircut: number;
    exchange: Exchange;
    market: Market;
    security: Security;
}