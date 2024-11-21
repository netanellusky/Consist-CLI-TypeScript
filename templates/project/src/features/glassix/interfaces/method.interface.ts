import { ProtocolType, SubProtocolType, Ticket, TicketState } from './ticket.interface'

export interface CreateTicketMethod {
    culture: 'he-IL' | 'en-US' | 'es-ES' | 'pt-PT'
    state?: TicketState
    getAvailableUser?: boolean
    addIntroductionMessage?: boolean
    enableWebhook?: boolean
    markAsRead?: boolean
    field1?: string
    field2?: string
    field3?: string
    field4?: string
    field5?: string
    field6?: string
    field7?: string
    field8?: string
    field9?: string
    field10?: string
    participants: Participant[]
    tags?: string[]
    uniqueArgument?: string
}

interface Participant {
    type: 'Client' | 'User'
    protocolType: ProtocolType
    isActive?: boolean
    isDeleted?: boolean
    id?: number
    name?: string
    displayName?: string
    subProtocolType?: SubProtocolType
    identifier?: string
    departmentIdentifier?: string
    contactId?: string
    userName?: string
}

export interface AddNote {
    text?: string
    html?: string
}


export interface SetFieldMethod {
    details?: Details;
    field7?: string;
    field1?: string;
    field2?: string;
    field3?: string;
    field4?: string;
    field5?: string;
    field6?: string;
    field8?: string;
    field9?: string;
    field10?: string;
    uniqueArgument?: string;
}

interface Details {
    source?: Source;
    identityTokenClaims?: any;
    userAgent?: string;
    iPAddress?: string;
    location?: string;
    externalLink?: string;
    isMobile?: boolean;
}

interface Source {
    title?: string;
    uri?: string;
}

export interface TicketListQueryParams {
    since: string;
    until: string;
    ticketState?: TicketState;
    sortOrder?: 'ASC' | 'DESC';
    page?: string
}

export interface TicketListResponse {
    tickets: Ticket[]
    paging: null | Paging
}

interface Paging {
    next: string
}

export interface PhoneCallPayload {
    dateTime?: string
    audioUri?: string
}

export enum PhoneCallMethod {
    Started = 'started',
    Ended = 'ended',
    Audiolink = 'audiolink'
}