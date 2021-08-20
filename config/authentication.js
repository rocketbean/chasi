import globals from '../package/globals.js'

export default {
    default  : 'jwt',
    gateway  : {
        api: {
            driver: 'jwt',
            enabled: true,
            sessions: true,
            key: 'Chasi',
            model:  '../container/Models/User',
            AuthRouteExceptions: [
                /**
                 * By default, all routes will
                 * Be protected by [JWT]
                 * to excempt some routes,
                 * it should be registered here..
                 */
                {"m": "POST", "url": "/api/login"},
            ]
        },
        chasi: {
            driver: 'jwt',
            enabled: true,
            sessions: true,
            key: 'Chasi',
            model: '../container/Models/User',
            AuthRouteExceptions: [
                /**
                 * By default, all routes will
                 * Be protected by [JWT]
                 * to excempt some routes,
                 * it should be registered here..
                 */
            ]
        }
    }
}