module.exports = {
    default  : 'jwt',
    gateway  : {
        api: {
            driver: 'jwt',
            enabled: true,
            sessions: true,
            key: 'Chasi',
            model: 'users',
            AuthRouteExceptions: [
                /**
                 * when enabled, all routes will
                 * Be protected by [JWT]
                 * to excempt some routes,
                 * it should be registered here..
                 */
                {"m": "POST", "url": "/api/login"},
                {"m": "GET", "url": "/api/post"},
            ]
        },
        
        chasi: {
            driver: 'jwt',
            enabled: false,
            sessions: true,
            key: 'Chasi',
            model: 'users',
            AuthRouteExceptions: [
                /**
                 * when enabled, all routes will
                 * Be protected by [JWT] when
                 * to excempt some routes,
                 * it should be registered here..
                 */
            ]
        },
        
        web: {
            driver: 'jwt',
            enabled: false,
            sessions: true,
            key: 'Chasi',
            model: 'users',
            AuthRouteExceptions: [
                /**
                 * when enabled, all routes will
                 * Be protected by [JWT]
                 * to excempt some routes,
                 * it should be registered here..
                 */
                {"m": "GET", "url": ""},
                {"m": "GET", "url": "/helloworld"},
            ]
        },

        test: {
            driver: 'jwt',
            enabled: true,
            sessions: true,
            key: 'Chasi',
            model: 'users',
            AuthRouteExceptions: [
                /**
                 * when enabled, all routes will
                 * Be protected by [JWT]
                 * to excempt some routes,
                 * it should be registered here..
                 */
            ]
        },
    }
}