
import { TicketMinimal, Transaction, TicketState } from "./ticket.interface";

export interface Webhook<TChange> {
    key: string;
    dateTime: string;
    changes: TChange[];
}

interface TicketChangeBase {
    _event: string;
    ticketId: number;
}

interface TicketChange extends TicketChangeBase {
    ticket: TicketMinimal;
}

export interface TicketOwnerChange extends TicketChange {
    ownerId: string;
    ownerUserName: string;
}

export interface TicketStateChange extends TicketChange {
    ticketState: TicketState;
}

export type NewTicket = TicketChange;


export interface NewMessage extends TicketChangeBase {
    transaction: Transaction;
}
