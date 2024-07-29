import { Page } from "puppeteer";

const sendTelegramMessage = async (message: string, page: Page) => {
  return new Promise<void>(async (resolve) => {
    setTimeout(async () => {
      await page.waitForSelector(".input-message-container", { timeout: 0 });
      await page.click(".input-message-container");
      await page.type(".input-message-input", message);
      await page.waitForSelector(".btn-send-container", { timeout: 0 });
      await page.click(".btn-send-container");
      resolve();
    }, 1000);
  });
};

export default sendTelegramMessage;
