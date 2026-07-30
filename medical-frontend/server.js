const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = __dirname;
const port = process.env.PORT || 5173;
const host = process.env.HOST || "0.0.0.0";
const backendHost = process.env.BACKEND_HOST || "127.0.0.1";
const backendPort = process.env.SERVER_PORT || process.env.BACKEND_PORT || 8080;
const proxyPrefixes = ["/api", "/image", "/swagger-ui", "/v3/api-docs", "/swagger-resources", "/webjars"];
const types = {
    ".html": "text/html;charset=utf-8",
    ".css": "text/css;charset=utf-8",
    ".js": "application/javascript;charset=utf-8",
    ".json": "application/json;charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};
const compressibleTypes = new Set([
    "text/html;charset=utf-8",
    "text/css;charset=utf-8",
    "application/javascript;charset=utf-8",
    "application/json;charset=utf-8",
    "image/svg+xml"
]);

function shouldProxy(requestPath) {
    return proxyPrefixes.some((prefix) => requestPath === prefix || requestPath.startsWith(`${prefix}/`));
}

function proxyToBackend(req, res) {
    const headers = {...req.headers, host: `${backendHost}:${backendPort}`};
    const proxyReq = http.request({
        hostname: backendHost,
        port: backendPort,
        path: req.url,
        method: req.method,
        headers
    }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on("error", () => {
        res.writeHead(502, {"Content-Type": "application/json;charset=utf-8"});
        res.end(JSON.stringify({code: 50000, mess: "Backend service is not reachable"}));
    });

    req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
    const rawPath = decodeURIComponent(req.url.split("?")[0]);
    if (shouldProxy(rawPath)) {
        proxyToBackend(req, res);
        return;
    }

    const requestPath = rawPath === "/" ? "/index.html" : rawPath;
    const filePath = path.normalize(path.join(root, requestPath));

    if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }
        const contentType = types[path.extname(filePath)] || "application/octet-stream";
        const headers = {
            "Content-Type": contentType,
            "Cache-Control": requestPath.startsWith("/assets/") ? "public, max-age=86400" : "no-cache"
        };
        const acceptsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "");

        if (acceptsGzip && compressibleTypes.has(contentType)) {
            zlib.gzip(content, (zipErr, compressed) => {
                if (zipErr) {
                    res.writeHead(200, headers);
                    res.end(content);
                    return;
                }
                res.writeHead(200, {...headers, "Content-Encoding": "gzip", "Vary": "Accept-Encoding"});
                res.end(compressed);
            });
            return;
        }

        res.writeHead(200, headers);
        res.end(content);
    });
});

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.log("");
        console.log("Frontend service is already running.");
        console.log(`Frontend URL: http://localhost:${port}`);
        console.log("");
        process.exit(0);
    }
    throw error;
});

server.listen(port, host, () => {
    console.log("");
    console.log("Medical frontend started.");
    console.log(`Frontend URL: http://localhost:${port}`);
    console.log(`Listening on: http://${host}:${port}`);
    console.log(`Proxy backend: http://${backendHost}:${backendPort}`);
    console.log("");
});
