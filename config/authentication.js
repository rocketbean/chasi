module.exports = {
    default  : 'jwt',
    gateway  : {
        api: {
            driver: 'jwt',
            enabled: true,
            key: 'Chasi',
            model: require('../container/Models/User'),
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
            key: 'Chasi',
            model: require('../container/Models/User'),
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