/**
 * Email šablony pro Čečovickou padesátku
 */

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

const baseStyles = `
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
`;

const colors = {
    dark: "#1a1a2e",
    gray: "#252538",
    gold: "#fbbf24",
    goldHover: "#fcd34d",
    text: "#e5e5e5",
    textMuted: "#9ca3af",
    white: "#ffffff",
};

function emailWrapper(content: string): string {
    return `
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Čečovická padesátka</title>
    <style type="text/css">${baseStyles}</style>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.dark};">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${colors.dark};">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">

                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 30px;">
                            <h1 style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: bold; color: ${colors.white};">
                                ČEČOVICKÁ<span style="color: ${colors.gold};">50</span>
                            </h1>
                            <p style="margin: 8px 0 0 0; font-family: Arial, sans-serif; font-size: 12px; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 2px;">
                                Ultra běh v srdci západních Čech
                            </p>
                        </td>
                    </tr>

                    <!-- Content Box -->
                    <tr>
                        <td style="background-color: ${colors.gray}; border-radius: 12px; padding: 40px;">
                            ${content}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding-top: 30px;">
                            <p style="margin: 0 0 8px 0; font-family: Arial, sans-serif; font-size: 14px; color: ${colors.textMuted};">
                                1. října 2027 • Čečovice, Plzeň-jih
                            </p>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: ${colors.textMuted};">
                                © 2025 Čečovická padesátka
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Ověřovací email - odesílá se po registraci
 */
export function verificationEmailTemplate(jmeno: string, verifyUrl: string): string {
    const content = `
        <h2 style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: ${colors.white};">
            Ahoj ${escapeHtml(jmeno)}! 👋
        </h2>

        <p style="margin: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${colors.text};">
            Děkujeme za registraci na první ročník <strong style="color: ${colors.gold};">Čečovické padesátky</strong>.
        </p>

        <p style="margin: 0 0 30px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${colors.text};">
            Pro dokončení registrace prosím potvrď svůj email kliknutím na tlačítko níže:
        </p>

        <!-- Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
            <tr>
                <td style="border-radius: 8px; background-color: ${colors.gold};">
                    <a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: ${colors.dark}; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                        Potvrdit registraci
                    </a>
                </td>
            </tr>
        </table>

        <p style="margin: 30px 0 0 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${colors.textMuted};">
            Odkaz je platný 24 hodin. Pokud jsi registraci neprováděl/a, tento email prosím ignoruj.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid rgba(255,255,255,0.1);">

        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: ${colors.textMuted};">
            Nefunguje tlačítko? Zkopíruj tento odkaz do prohlížeče:<br>
            <a href="${verifyUrl}" style="color: ${colors.gold}; word-break: break-all;">${verifyUrl}</a>
        </p>
    `;

    return emailWrapper(content);
}

/**
 * Potvrzovací email - odesílá se po úspěšném ověření
 */
export function confirmationEmailTemplate(jmeno: string, websiteUrl: string): string {
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 80px; height: 80px; line-height: 80px; border-radius: 50%; background-color: rgba(251, 191, 36, 0.2); border: 2px solid ${colors.gold}; font-size: 40px;">
                ✓
            </div>
        </div>

        <h2 style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: ${colors.white}; text-align: center;">
            Registrace <span style="color: ${colors.gold};">dokončena!</span>
        </h2>

        <p style="margin: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${colors.text}; text-align: center;">
            Skvělé, ${escapeHtml(jmeno)}! Tvoje registrace na <strong style="color: ${colors.gold};">Čečovickou padesátku</strong> byla úspěšně dokončena.
        </p>

        <p style="margin: 0 0 30px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${colors.text}; text-align: center;">
            Těšíme se na tebe <strong style="color: ${colors.white};">1. října 2027</strong> na startu!
        </p>

        <!-- Info Box -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${colors.dark}; border-radius: 8px; margin-bottom: 30px;">
            <tr>
                <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: ${colors.gold};">
                        📋 Co bude následovat?
                    </h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8; color: ${colors.text};">
                        <li>Budeme tě informovat o novinkách ohledně závodu</li>
                        <li>Podrobnosti o prezentaci obdržíš před závodem</li>
                        <li>Sleduj naše sociální sítě pro aktuální informace</li>
                    </ul>
                </td>
            </tr>
        </table>

        <!-- Stats -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
            <tr>
                <td width="33%" style="text-align: center; padding: 16px;">
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: ${colors.gold};">50 km</div>
                    <div style="font-family: Arial, sans-serif; font-size: 12px; color: ${colors.textMuted}; text-transform: uppercase;">Celková délka</div>
                </td>
                <td width="33%" style="text-align: center; padding: 16px; border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: ${colors.gold};">8×</div>
                    <div style="font-family: Arial, sans-serif; font-size: 12px; color: ${colors.textMuted}; text-transform: uppercase;">Okruhů</div>
                </td>
                <td width="33%" style="text-align: center; padding: 16px;">
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: ${colors.gold};">850 m</div>
                    <div style="font-family: Arial, sans-serif; font-size: 12px; color: ${colors.textMuted}; text-transform: uppercase;">Převýšení</div>
                </td>
            </tr>
        </table>

        <!-- Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
            <tr>
                <td style="border-radius: 8px; background-color: ${colors.gold};">
                    <a href="${websiteUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: ${colors.dark}; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                        Navštívit web závodu
                    </a>
                </td>
            </tr>
        </table>
    `;

    return emailWrapper(content);
}