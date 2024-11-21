export interface TokenGlassixRequest {
    apiKey: string
    apiSecret: string
    userName: string
}

export interface TokenGlassixResponse {
    access_token: string
    token_type: string
    expires_in: number
}

export interface TokenGlassix extends TokenGlassixResponse {
    workspace: string
}