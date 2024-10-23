class CachedRequestsManager {
    static cache = new Map();
    static cacheLifeTime = 10000; 

    static startCachedRequestsCleaner() {
        setInterval(() => {
            this.flushExpired();
            console.log("Cache cleaner started.");
        }, this.cacheLifeTime);
    }

    static add(url, content, ETag = "") {
        const expiration = Date.now() + this.cacheLifeTime;
        this.cache.set(url, { content, ETag, expiration });
        console.log(`Ajout dans la cache: ${url}`);
    }

    static find(url) {
        return this.cache.get(url);
    }

    static clear(url) {
        this.cache.delete(url);
        console.log(`Efface la cache associée à l'url: ${url}`);
    }

    static flushExpired() {
        const now = Date.now();
        for (const [url, { expiration }] of this.cache) {
            if (now > expiration) { 
                this.cache.delete(url);
                console.log(`Retrait de cache expirée avec l'url associé: ${url}`);
            }
        }
    }

    static get(HttpContext) {
        const url = HttpContext.req.url;
        const cached = this.find(url);
        if (cached) {
            console.log(`Extraction de la cache avec l'url associé: ${url}`);
            HttpContext.response.JSON(cached.content, cached.ETag, true);
            return true;
        } else {
            console.log(`Cache miss: ${url}`);
            return false;
        }
    }
}

export default CachedRequestsManager;