import type { Env, TurnstileResponse, FormDataFields } from "../types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB, TURNSTILE_SECRET } = context.env;

    try {
        const fields = await parseFormData(context.request);

        validateEmail(fields.email);
        await verifyTurnstile(fields.turnstileToken, TURNSTILE_SECRET);

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        await insertRegistrace(DB, fields, token, expiresAt);

        // const verifyUrl = `${new URL(context.request.url).origin}/api/verify?token=${token}`;
        // await sendVerificationEmail(fields.email, fields.jmeno, verifyUrl, RESEND_API_KEY);

        return Response.redirect("/registrace-uspesna.html", 303);
    } catch (error) {
        return handleError(error);
    }
};

async function parseFormData(request: Request): Promise<FormDataFields> {
    const formData = await request.formData();

    const jmeno = formData.get("jmeno");
    const email = formData.get("email");
    const turnstileToken = formData.get("cf-turnstile-response");

    if (!jmeno || !email || !turnstileToken) {
        throw new ValidationError("Chybí povinná pole");
    }

    return {
        jmeno: jmeno.toString(),
        email: email.toString(),
        turnstileToken: turnstileToken.toString(),
    };
}

function validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError("Neplatný formát emailu");
    }
}

async function verifyTurnstile(token: string, secret: string): Promise<void> {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`,
    });

    const result: TurnstileResponse = await response.json();

    if (!result.success) {
        throw new ValidationError("Turnstile ověření selhalo");
    }
}

async function insertRegistrace(
    db: D1Database,
    fields: FormDataFields,
    token: string,
    expiresAt: string
): Promise<void> {
    try {
        await db
            .prepare(
                `INSERT INTO registrace (email, jmeno, token, token_expires_at) 
         VALUES (?, ?, ?, ?)`
            )
            .bind(fields.email, fields.jmeno, token, expiresAt)
            .run();
    } catch (error) {
        if (error instanceof Error && error.message.includes("UNIQUE")) {
            throw new ConflictError("Email již existuje");
        }
        throw error;
    }
}

async function sendVerificationEmail(
    email: string,
    jmeno: string,
    verifyUrl: string,
    apiKey: string
): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "registrace@tvojedomena.cz",
            to: email,
            subject: "Potvrzení registrace",
            html: `
        <h1>Ahoj ${escapeHtml(jmeno)},</h1>
        <p>Děkujeme za registraci. Pro dokončení klikni na odkaz níže:</p>
        <p><a href="${verifyUrl}">Potvrdit registraci</a></p>
        <p>Odkaz je platný 24 hodin.</p>
      `,
        }),
    });

    if (!response.ok) {
        throw new Error("Nepodařilo se odeslat email");
    }
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function handleError(error: unknown): Response {
    if (error instanceof ValidationError) {
        return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof ConflictError) {
        return Response.json({ error: error.message }, { status: 409 });
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Unexpected error:", errorMessage, error);
    return Response.json({ error: "Interní chyba serveru", details: errorMessage }, { status: 500 });
}

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}
