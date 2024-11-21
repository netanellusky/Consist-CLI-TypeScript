export class AzureKeyVaultServiceError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        Object.setPrototypeOf(this, AzureKeyVaultServiceError.prototype);
        this.name = 'AzureKeyVaultServiceError';
        this.statusCode = statusCode;
    }
}
