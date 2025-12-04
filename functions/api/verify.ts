import type { Env, Registrace } from "../types";
import { confirmationEmailTemplate } from "../email-templates";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB, RESEND_API_KEY } = context.env;
    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");

    if (!token) {
        return createErrorResponse("Chybí ověřovací token", 400);
    }

    try {
        const registrace = await DB.prepare(
            `SELECT * FROM registrace WHERE token = ?`
        )
            .bind(token)
            .first<Registrace>();

        if (!registrace) {
            return createErrorResponse("Neplatný ověřovací odkaz", 404);
        }

        if (registrace.verified === 1) {
            return createRedirect(url.origin, "already-verified");
        }

        const now = new Date();
        const expiresAt = new Date(registrace.token_expires_at);

        if (now > expiresAt) {
            return createErrorResponse("Ověřovací odkaz vypršel", 410);
        }

        await DB.prepare(`UPDATE registrace SET verified = 1 WHERE token = ?`)
            .bind(token)
            .run();

        // Odeslat potvrzovací email
        await sendConfirmationEmail(
            registrace.email,
            registrace.jmeno,
            url.origin,
            RESEND_API_KEY
        );

        return createRedirect(url.origin, "success");
    } catch (error) {
        console.error("Verify error:", error);
        return createErrorResponse("Interní chyba serveru", 500);
    }
};

async function sendConfirmationEmail(
    email: string,
    jmeno: string,
    websiteUrl: string,
    apiKey: string
): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "Čečovická padesátka <info@cecovicka-padesatka.cz>",
            to: email,
            subject: "Registrace dokončena! - Čečovická padesátka",
            html: confirmationEmailTemplate(jmeno, websiteUrl),
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Resend confirmation error:", response.status, errorBody);
        // Neházíme chybu - registrace proběhla, jen se nepodařilo odeslat potvrzení
    }
}

function createRedirect(origin: string, status: string): Response {
    if (status === "success") {
        return Response.redirect(`${origin}/registrace-uspesna.html`, 302);
    }
    return Response.redirect(`${origin}/registrace-uspesna.html?status=${status}`, 302);
}

function createErrorResponse(message: string, status: number): Response {
    return new Response(
        `<!DOCTYPE html>
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chyba ověření</title>
            <style>
                body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                h1 { color: #dc2626; }
                a { color: #2563eb; }
            </style>
        </head>
        <body>
            <h1>Chyba</h1>
            <p>${message}</p>
            <p><a href="/">Zpět na hlavní stránku</a></p>
        </body>
        </html>`,
        {
            status,
            headers: { "Content-Type": "text/html; charset=utf-8" },
        }
    );
}