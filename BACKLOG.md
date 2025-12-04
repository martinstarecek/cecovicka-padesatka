# Backlog

## Vysoká priorita

- [ ] **Cache invalidace přes Cloudflare API** - Po ověření registrace (`/api/verify`) zavolat Cloudflare API pro purge cache `/api/stats`. Vyžaduje nastavení `CF_API_TOKEN` a `CF_ZONE_ID` v environment variables.

## Střední priorita

- [ ] **Rate limiting pro API endpointy** - Implementovat rate limiting pomocí Cloudflare KV nebo Durable Objects pro ochranu proti zneužití.

## Nízká priorita

- [ ] **Interaktivní mapa trasy** - Integrace s Mapy.cz nebo Mapbox pro zobrazení GPX trasy.
- [ ] **Seznam registrovaných běžců** - Veřejná stránka se jmény potvrzených účastníků.