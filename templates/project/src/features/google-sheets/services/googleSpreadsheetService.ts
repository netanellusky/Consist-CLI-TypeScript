// services/GoogleSpreadsheetService.ts

import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { Column } from "../interfaces/column.interface";
import logger from '../../../core/logger';
import envConfig from '../../../config/envConfig';

/**
 * Service for interacting with a Google Spreadsheet containing team member data.
 * Implements a singleton pattern to ensure a single instance throughout the application.
 */
class GoogleSpreadsheetService {
    private static instance: GoogleSpreadsheetService;
    private doc: GoogleSpreadsheet;
    private sheet: GoogleSpreadsheetWorksheet | null = null;
    private data: Column[] = [];
    private lastFetchTime: Date | null = null;
    private isFetching: boolean = false;

    private constructor() {
        this.doc = new GoogleSpreadsheet(envConfig.google.spreadsheetId, this.authenticate());
    }

    private authenticate(): JWT {
        return new JWT({
            email: envConfig.google.serviceAccountEmail,
            key: envConfig.google.privateKey,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    }

    /**
     * Retrieves the singleton instance of GoogleSpreadsheetService.
     * @returns The singleton instance.
     */
    public static getInstance(): GoogleSpreadsheetService {
        if (!GoogleSpreadsheetService.instance) {
            GoogleSpreadsheetService.instance = new GoogleSpreadsheetService();
        }
        return GoogleSpreadsheetService.instance;
    }

    /**
     * Loads the Google Spreadsheet and initializes the sheet property.
     * @throws Will throw an error if the sheet cannot be loaded.
     */
    private async loadSheet(): Promise<void> {
        try {
            await this.doc.loadInfo();
            const sheet = this.doc.sheetsByIndex[0];
            if (!sheet) {
                throw new Error("Sheet not found.");
            }
            this.sheet = sheet;
        } catch (error) {
            logger.error("Failed to load sheet:", error);
            throw error;
        }
    }

    /**
     * Fetches data from the Google Spreadsheet and updates the internal data store.
     * Prevents concurrent fetches.
     */
    public async fetchData(): Promise<void> {
        if (this.isFetching) {
            logger.warn("Fetch data is already in progress. Skipping...");
            return;
        }
        this.isFetching = true;
        try {
            logger.info("Fetching data from Google Spreadsheet...");
            if (!this.sheet) {
                await this.loadSheet();
            }
            if (this.sheet) {
                const rows = await this.sheet.getRows();
                this.data = rows.map(row => row.toObject() as Column);
                this.lastFetchTime = new Date();
                logger.info("Data fetched successfully at", this.lastFetchTime.toISOString());
            } else {
                throw new Error("Sheet is not loaded.");
            }
        } catch (error) {
            logger.error("Failed to fetch data from Google Spreadsheet:", error);
            throw error;
        } finally {
            this.isFetching = false;
        }
    }

    /**
     * Returns a copy of the current team member data.
     * @returns An array of Column objects.
     */
    public getData(): Column[] {
        return [...this.data];
    }

    /**
     * Retrieves a team member by first and last name.
     * @param firstName The first name of the team member.
     * @param lastName The last name of the team member.
     * @returns The team member object or null if not found.
     */
    public getUser(firstName: string, lastName: string): Column | null {
        return this.data.find(Column => Column.firstName === firstName && Column.lastName === lastName) || null;
    }


    /**
     * Gets the timestamp of the last successful data fetch.
     * @returns The Date of the last fetch or null if never fetched.
     */
    public getLastFetchTime(): Date | null {
        return this.lastFetchTime;
    }
}

export default GoogleSpreadsheetService;
