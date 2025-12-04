import type { Env } from "../types";

interface StatsResult {
    count: number;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;

    try {
        const result = await DB.prepare(
            "SELECT COUNT(*) as count FROM registrace WHERE verified = 1"
        ).first<StatsResult>();

        const count = result?.count ?? 0;

        return Response.json(
            { count },
            {
                headers: {
                    // Krátká cache (10s) + stale-while-revalidate pro rychlou odezvu
                    // Po verify se nová hodnota zobrazí max do 10 sekund
                    "Cache-Control": "public, max-age=10, stale-while-revalidate=50",
                },
            }
        );
    } catch (error) {
        console.error("Stats error:", error);
        return Response.json({ count: 0 }, { status: 500 });
    }
};