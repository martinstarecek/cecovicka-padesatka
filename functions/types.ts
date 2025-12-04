export interface Env {
    DB: D1Database;
    // RESEND_API_KEY: string;
    TURNSTILE_SECRET: string;
}

export interface Registrace {
    id: number;
    email: string;
    jmeno: string;
    token: string;
    verified: number;
    token_expires_at: string;
    created_at: string;
}

export interface TurnstileResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
    action?: string;
    cdata?: string;
}

export interface FormDataFields {
    jmeno: string;
    email: string;
    turnstileToken: string;
}