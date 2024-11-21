import glassixService from '../services/apiService';
import logger from '../../../core/logger';
import { ParticipantType, Ticket, TicketState, PhoneCallPayload, PhoneCallMethod, CreateTicketMethod, AddNote, User } from '../interfaces'
import { LRUCache } from 'lru-cache';

const userCache = new LRUCache<string, User[]>({ max: 500 });

export async function createTicket(departmentId: string, payload: CreateTicketMethod, owner: string | null = null): Promise<Ticket> {
    try {
        const response = await glassixService.createTicket(departmentId, payload, owner);
        return response;
    } catch (error) {
        logger.error("Error creating ticket: " + error);
        throw error;
    }
}

export async function addTags(departmentId: string, ticketId: number, tags: string[]): Promise<any> {
    try {
        const response = await glassixService.addTags(departmentId, ticketId, tags);
        return response;
    }
    catch (error) {
        logger.error("Error adding tags: " + error);
        throw error;
    }
}

export async function setState(departmentId: string, ticketId: number, state: TicketState, summary: string | null = null): Promise<any> {
    try {
        const response = await glassixService.setState(departmentId, ticketId, state, summary);
        return response;
    } catch (error) {
        logger.error("Error setting state for ticket: " + error);
        throw error;
    }
}

export async function getTicket(departmentId: string, ticketId: number): Promise<Ticket> {
    try {
        const response = await glassixService.getTicket(departmentId, ticketId);
        return response;
    } catch (error) {
        logger.error("Error getting ticket: " + error);
        throw error;
    }
}

async function getUsers(departmentId: string): Promise<User[]> {
    const cacheKey = `users_${departmentId}`;
    let users: User[] | undefined = userCache.get(cacheKey);

    if (!users) {
        try {
            const response = await glassixService.getUsers(departmentId);
            users = response;
            userCache.set(cacheKey, users);
        } catch (error) {
            logger.error("Error getting users: " + error);
            throw error;
        }
    }

    return users;
}

export async function phoneCall(departmentId: string, ticketId: number, payload: PhoneCallPayload, method: PhoneCallMethod): Promise<any> {
    try {
        const response = await glassixService.phoneCall(departmentId, ticketId, payload, method);
        return response;
    } catch (error) {
        logger.error("Error making phone call: " + error);
        throw error;
    }
}

export async function addNote(departmentId: string, ticketId: number, payload: AddNote): Promise<any> {
    try {
        const response = await glassixService.addNote(departmentId, ticketId, payload);
        return response;
    } catch (error) {
        logger.error("Error adding note: " + error);
        throw error;
    }
}

export async function getUserByUserName(departmentId: string, userName: string): Promise<User | undefined> {
    const users = await getUsers(departmentId);
    return users.find(user => user.UserName.toLowerCase() === userName.toLowerCase());
}

export async function isBot(departmentId: string, userName: string): Promise<boolean> {
    const user = await getUserByUserName(departmentId, userName);
    return user?.type === ParticipantType.BOT
}