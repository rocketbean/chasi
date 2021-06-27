module.exports = {
    emailContainer: "container/modules/Mailer/emails/",
    authentication: {
        key: checkout(process.env.mailerKey, "SG."),
        baseUrl: checkout(process.env.mailerBaseUrl),
        verificationUrl: 'unverified/verify',
        email: checkout(process.env.mailerEmail)
    }
}
