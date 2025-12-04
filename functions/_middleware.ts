interface Env {
    AUTH_USERNAME: string;
    AUTH_PASSWORD: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { AUTH_USERNAME, AUTH_PASSWORD } = context.env;

    // Pokud nejsou credentials nastaveny, pokračuj bez auth
    if (!AUTH_USERNAME || !AUTH_PASSWORD) {
        return context.next();
    }

    const authorization = context.request.headers.get("Authorization");

    if (authorization) {
        const [scheme, encoded] = authorization.split(" ");

        if (scheme === "Basic" && encoded) {
            const decoded = atob(encoded);
            const [username, password] = decoded.split(":");

            if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
                return context.next();
            }
        }
    }

    return new Response("Unauthorized", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Protected Area"',
        },
    });
};