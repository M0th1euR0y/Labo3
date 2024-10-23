//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This module define the http Response class
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Author : Nicolas Chourot
// Lionel-Groulx College
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
import CachedRequestsManager from './cachedRequestManager.js'; // Ajout de l'importation

export default class Response {
    constructor(HttpContext) {
        this.HttpContext = HttpContext;
        this.res = HttpContext.res;
        this.errorContent = "";
    }

    status(number, errorMessage = '') {
        if (errorMessage) {
            this.res.writeHead(number, { 'content-type': 'application/json' });
            this.errorContent = { "error_description": errorMessage };
            return this.end(JSON.stringify(this.errorContent));
        } else {
            this.res.writeHead(number, { 'content-type': 'text/plain' });
            return this.end();
        }
    }

    end(content = null) {
        if (content) {
            this.res.end(content);
        } else {
            this.res.end();
        }
        console.log("Response status:", this.res.statusCode, this.errorContent);
        return true;
    }

    ok() { return this.status(200); }       // ok status

    ETag(ETag) {
        console.log("Response header ETag key:", ETag);
        this.res.writeHead(204, { 'ETag': ETag });
        this.end();
    }

    JSON(obj, ETag = "", fromCache = false) {  
        if (ETag != "")
            this.res.writeHead(200, { 'content-type': 'application/json', 'ETag': ETag });
        else
            this.res.writeHead(200, { 'content-type': 'application/json' });
        
        if (obj != null) {
            let content = JSON.stringify(obj);
            console.log(FgCyan + Bright, "Response payload -->", content.toString().substring(0, 75) + "...");

            if (!fromCache && this.HttpContext.req.url.startsWith('/api/') && !obj.id) {
                CachedRequestsManager.add(this.HttpContext.req.url, obj, ETag);
            }

            return this.end(content);
        } else {
            return this.end();
        }
    }
    

    HTML(content) {
        this.res.writeHead(200, { 'content-type': 'text/html' });
        return this.end(content);
    }

    accepted() { return this.status(202); }
}