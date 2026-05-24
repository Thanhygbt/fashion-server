const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;

function sendJson(res, statusCode, payload) {
    if (res.writableEnded) return;
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

function readRequestBody(req, res, callback, maxBytes = DEFAULT_MAX_BODY_BYTES) {
    let body = "";
    let size = 0;
    let rejected = false;

    req.on("data", (chunk) => {
        if (rejected) return;

        size += chunk.length;
        if (size > maxBytes) {
            rejected = true;
            sendJson(res, 413, { message: "Request body too large" });
            req.destroy();
            return;
        }

        body += chunk.toString();
    });

    req.on("end", () => {
        if (!rejected) callback(body);
    });

    req.on("error", () => {
        if (!rejected) sendJson(res, 400, { message: "Invalid request body" });
    });
}

module.exports = { readRequestBody };
