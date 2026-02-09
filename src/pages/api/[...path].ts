export const prerender = false;

import { retrieveFile } from '../../lib/utils/googleDrive.js';
import { LRUCache } from 'lru-cache';

const tokenCache = new LRUCache({
    max: 500,
    ttl: 60 * 1000, 
});

export async function GET({ params, request }) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const tokenCount = (tokenCache.get(ip) as number) || 0;
    const apiKey = request.headers.get('api-key');

    if (apiKey !== import.meta.env.API_KEY) {
        return new Response(JSON.stringify({ error: "Unauthorized access" }), { 
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }
  
    if (tokenCount >= 10) {
        return new Response(JSON.stringify({ error: "Too many requests. Chill muna!" }), {
            status: 429, 
            headers: { "Content-Type": "application/json" }
        });
    }
    tokenCache.set(ip, tokenCount + 1);
    // ---------------------------

    const fullPath = params.path;

    if (!fullPath) {
        return new Response(JSON.stringify({ error: "Path is required" }), { status: 400 });
    }

    const segments = fullPath.split('--');
    const folderId = segments[segments.length - 1];

    const currentUrl = fullPath;

    try {
        const data = await retrieveFile(folderId, currentUrl);

        return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
        });
    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}