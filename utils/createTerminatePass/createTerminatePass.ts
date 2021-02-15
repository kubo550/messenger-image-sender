import crypto from "crypto";

export const getTerminatePass = () =>
    crypto.randomBytes(10).toString('hex')
