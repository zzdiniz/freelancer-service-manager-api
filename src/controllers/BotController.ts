import { Request, Response } from "express";
import puppeteer from "puppeteer";
import getBotFatherChat from "../helpers/get-bot-father-chat";
import sendTelegramMessage from "../helpers/send-telegram-msg";
import getLastTelegramMsg from "../helpers/get-last-telegram-msg";
import getBotInfosByMsg from "../helpers/get-bot-infos-by-msg";
import Bot from "../models/Bot";
import ProviderInterface from "../types/ProviderInterface";
import getTelegramQrCode from "../helpers/get-telegram-qr-code";

export default class BotController {
  static async create(req: Request, res: Response) {
    const { name }: { name: string } = req.body;
    const provider = res.locals.provider as ProviderInterface;

    if (!name) {
      return res.status(422).json({ message: "You must send a bot name" });
    }

    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();

      await page.goto("https://web.telegram.org/k/");

      const qrcode = await getTelegramQrCode(page);
      res.setHeader("Content-Type", "image/png");
      res.send(Buffer.from(qrcode, "base64"));

      await page.waitForSelector(".input-search", { timeout: 0 });
      await page.click(".input-search");
      await page.type(".input-field-input", "@BotFather");
      await page.waitForSelector(
        ".search-group .chatlist .row .dialog-subtitle .row-subtitle",
        { timeout: 0 }
      );

      await getBotFatherChat(page);

      await page.waitForSelector(".bot-father", { timeout: 0 });
      await page.click(".bot-father");

      await sendTelegramMessage("/start", page);
      await sendTelegramMessage("/newbot", page);
      await sendTelegramMessage(`${name}`, page);

      const userName = `${name.toLowerCase().split(" ").join("_")}_bot`;
      await sendTelegramMessage(userName, page);
      await sendTelegramMessage(userName, page);

      const lastMessage = await getLastTelegramMsg(page);
      const botInfos = getBotInfosByMsg(lastMessage as string);

      if (!botInfos) {
        return;
      }
      const bot = new Bot({
        name,
        userName,
        link: botInfos.botLink,
        token: botInfos.botToken,
        providerId: provider.id as number,
      });
      bot.insert();
      return;
    } catch (error) {
      return res.status(500).json({ message: error });
    } finally {
      await browser.close();
    }
  }

  static async getByUsername(req: Request, res: Response){
    const { userName } = req.body

    if(!userName){
      return res.status(422).json({message: 'You must send an userName'})
    }

    try {
      const bot = await Bot.getByUsername(userName)
      if(!bot){
        return res.status(404).json({message: `Unable to find bot with username: ${userName}`})
      }

      return res.status(200).json(bot)
      
    } catch (error) {
      
    } 
  }

  static async getById(req: Request, res: Response){
    const { id } = req.params

    if(!id){
      return res.status(422).json({message: 'You must send an id'})
    }

    try {
      const bot = await Bot.getById(parseInt(id))
      if(!bot){
        return res.status(404).json({message: `Unable to find bot with id: ${id}`})
      }

      return res.status(200).json(bot)
      
    } catch (error) {
      return res.status(500).json({message: error})
    } 
  }
}
