import { Request, Response } from "express"

export default class BotController{
    static async create(req:Request,res:Response){
        const provider = res.locals.provider
        return console.log('provider',provider)
    }
}