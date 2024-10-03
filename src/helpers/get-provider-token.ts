import {Request} from 'express'

const getProviderToken = (req:Request) => {
    const token = req.headers.authorization?.split(" ")[1]
    return token
}

export default getProviderToken