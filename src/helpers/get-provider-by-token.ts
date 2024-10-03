import { JwtPayload, verify } from "jsonwebtoken"
import Provider from "../models/Provider"
import { Response } from "express"

const getProviderByToken = async (token:string,res:Response) => {
    if(!token){
        res.status(401).json({message:'Access denied'})
    }
    const tokenDecoded = verify(token,'secretSP') as JwtPayload

    const provider = Provider.getById(parseInt(tokenDecoded.id))

    return provider
}

export default getProviderByToken