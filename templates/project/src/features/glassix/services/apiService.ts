import { axiosInstance, getAxiosConfig } from "./axiosConfig";
import { Ticket, TicketState, User, CreateTicketMethod, AddNote, SetFieldMethod, TicketListResponse, TicketListQueryParams, PhoneCallPayload, PhoneCallMethod } from "../interfaces";

const apiService = {
    createTicket: async function (departmentId: string, payload: CreateTicketMethod, owner: string | null = null): Promise<Ticket> {
        const axiosConfig = await getAxiosConfig(departmentId, owner);
        const response = await axiosInstance.post<Ticket>(`${axiosConfig.baseURL}/tickets/create`, payload, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    getTicket: async function (departmentId: string, ticketId: number): Promise<Ticket> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const response = await axiosInstance.get<Ticket>(`${axiosConfig.baseURL}/tickets/get/${ticketId}`, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    addTags: async function (departmentId: string, ticketId: number, tags: string[]): Promise<any> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const response = await axiosInstance.post<Ticket>(`${axiosConfig.baseURL}/tickets/setfields/${ticketId}`, { tags }, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    addNote: async function (departmentId: string, ticketId: number, payload: AddNote): Promise<any> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const response = await axiosInstance.post<Ticket>(`${axiosConfig.baseURL}/tickets/addnote/${ticketId}`, payload, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    setfields: async function (departmentId: string, ticketId: number, payload: SetFieldMethod): Promise<Ticket> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const response = await axiosInstance.post<Ticket>(`${axiosConfig.baseURL}/tickets/setfields/${ticketId}`, payload, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    getUsers: async function (departmentId: string): Promise<User[]> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const response = await axiosInstance.get(`${axiosConfig.baseURL}/users/allusers`, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    listTickets: async function (departmentId: string, queryParams: TicketListQueryParams): Promise<TicketListResponse> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const { since, until, ticketState, sortOrder, page } = queryParams;
        const params = new URLSearchParams({ since, until, ...(ticketState && { ticketState }), ...(sortOrder && { sortOrder }), ...(page && { page }) });
        const response = await axiosInstance.get<TicketListResponse>(`${axiosConfig.baseURL}/tickets/list?${params}`, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    listNextPage: async function (departmentId: string, nextPage: string): Promise<TicketListResponse> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const response = await axiosInstance.get<TicketListResponse>(nextPage, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    setState: async function (departmentId: string, ticketId: number, state: TicketState, summary: string | null = null): Promise<any> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const payload = summary ? { summary } : {};

        const response = await axiosInstance.put<Ticket>(
            `/tickets/setstate/${ticketId}?nextState=${state}&getTicket=false&sendTicketStateChangedMessage=false&enableWebhook=false`, payload, {
            headers: axiosConfig.headers,
        });
        return response.data;
    },

    phoneCall: async function (departmentId: string, ticketId: number, payload: PhoneCallPayload, method: PhoneCallMethod): Promise<any> {
        const axiosConfig = await getAxiosConfig(departmentId);
        const response = await axiosInstance.post(`${axiosConfig.baseURL}/phonecalls/${method}/${ticketId}`, payload, {
            headers: axiosConfig.headers,
        });
        return response.data;
    }

};

export default apiService;
