export interface TicketBase {
    id: number;
    departmentId: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    field6: string;
    field7: string;
    field8: string;
    field9: string;
    field10: string;
    culture: string;
    ticketType: TicketType;
    tags: string[];
    owner: Owner;
    state: TicketState;
    open?: Date;
    close?: Date;
    lastActivity?: Date;
    uniqueArgument: string;
    details: Details;
    primaryProtocolType: ProtocolType;
    movedToTicketId: number;
    movedToDepartmentId: string;
    movedFromTicketId: number;
    movedFromDepartmentId: string;
    firstCustomerMessageDateTime?: Date;
    firstAgentMessageDateTime?: Date;
    firstAgentMessageUserId?: Date;
    lastCustomerMessageDateTime?: Date;
    queueTimeGross: string;
    queueTimeNet: string;
    firstAgentResponseTimeGross: string;
    firstAgentResponseTimeNet: string;
    agentAssignToResponseTimeGross: string;
    agentAssignToResponseTimeNet: string;
    firstAgentAllocationTimestamp?: Date;
    lastAgentAllocationTimestamp?: Date;
    agentMediaCount: number;
    customerMediaCount: number;
    agentMessagesCount: number;
    customerMessagesCount: number;
    durationNet: string;
    durationGross: string;
    agentResponseAverageTimeNet: string;
    totalConversationTimeNet: string;
    agentCannedRepliesCount: number;
    botConversationId: string;
    botConversations: string[];
    isIncoming: boolean;
    participants: Participant[];
    dynamicParameters: DynamicParameter[];
    botConversationSteps: BotConversationStep[];
    ticketSummary: TicketSummary;
}

export interface Ticket extends TicketBase {
    transactions: Transaction[];
}

export type TicketMinimal = TicketBase;

export interface Owner {
    id: string
    gender: string
    UserName: string
    culture: string
    isAnonymous: boolean
    uniqueArgument: string
    type: string
}

export interface Details {
    userAgent: string
    iPAddress: string
    location: string
    cardsPath: string
    source: Source
    externalLink: any
    isMobile: boolean
    identityTokenClaims: any
    referral: Referral
}

export interface Source {
    title: string
    uri: any
}

export interface Referral {
    utmParameters: any
    adId: string
    adTitle: string
    refData: string
    productId: string
    fbPostId: string
    instagramStoryId: string
    instagramStoryMediaUrl: any
    appleIntentId: string
    appleGroupId: string
    twitterRootTweetId: string
}

export interface Participant {
    id: number
    name: string
    type: string
    identifier: string
    departmentIdentifier: string
    displayName: string
    protocolType: ProtocolType
    subProtocolType: SubProtocolType
    isActive: boolean
    isDeleted: boolean
    contactId: string
    userName: string
}

export interface Transaction {
    guidTransactionId: string
    id: number
    dateTime: Date
    fromProtocolType: ProtocolType
    type: string
    text: string
    html: string
    status: string
    fromParticipant: Participant
    attachments: any[]
    payload?: Payload
}


export interface Payload {
    templates: Template[]
    enableFreeTextInput: boolean
    quickReplies?: any[]
}

export interface Template {
    title: string
    titleHtml: string
    subtitle: string
    subtitleHtml: string
    coverImageHeight: number
    coverImageWidth: number
    buttons: Button[]
}

export interface Button {
    title: string
    type: string
}

export interface BotConversationStep {
    departmentId: string
    botConversationId: string
    flowId: string
    flowVersion: number
    flowName: string
    stepType: string
    uniqueCardId: string
    cardFriendlyName?: string
    visitDatetime: Date
}

export interface TicketSummary {
    userId: string
    lastUpdateTimestamp: Date
    value: string
}

export interface DynamicParameter {
    id: string
    flowId: string
    name: string
    strValue: any
    boolValue: boolean
    numValue: number
    type: string
    creationDatetime: string
}


export enum ProtocolType {
    SMS = 'SMS',
    WhatsApp = 'WhatsApp',
    Mail = 'Mail',
    Web = 'Web',
    FacebookMessenger = 'FBmessenger',
    WebChatViaSMSLink = 'WebViaSMS',
    FacebookFeed = 'FacebookFeed',
    InstagramFeed = 'InstagramFeed',
    InstagramDirect = 'InstagramDM',
    PhoneCall = 'PhoneCall',
    Viber = 'Viber',
    Twitter = 'Twitter',
    AppleBusinessChat = 'AppleBusinessChat',
    GoogleBusinessMessages = 'GoogleBusinessMessages',
    GoogleBusinessReviews = 'Google Business Reviews'
}

export enum SubProtocolType {
    MailTo = 'MailTo',
    MailCc = 'MailCc',
    MailBcc = 'MailBcc'
}

export enum TicketState {
    OPEN = 'Open',
    CLOSED = 'Closed',
    PENDING = 'Pending',
    SNOOZED = 'Snoozed'
}

export enum TicketType {
    REGULAR = 'Regular',
    GLASSIX_BOT = 'GlassixBot',
}

export enum EventType {
    NEW_TICKET = 'NEW_TICKET',
    TICKET_OWNER_CHANGE = 'TICKET_OWNER_CHANGE',
    TICKET_STATE_CHANGE = 'TICKET_STATE_CHANGE',
    NEW_MESSAGE = 'NEW_MESSAGE',
}

export enum ParticipantType {
    USER = 'User',
    BOT = 'Bot',
    CLIENT = 'Client',
    SYSTEM = 'System',
}