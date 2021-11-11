module.exports = {
    /**
     * allow connections from this resource
     * [Arr|Str] 
     */
    origin: '*',
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}