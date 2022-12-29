
import { User } from './user';
import { Client } from './client';

export class UserBinding {
    terminalBindingId: number;
    user:User;
    clients:Client[];
}
