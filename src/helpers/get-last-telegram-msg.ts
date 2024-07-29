import { Page } from "puppeteer";

const getLastTelegramMsg = async (page: Page) => {
  await page.waitForSelector(".translatable-message");
  const lastMessage = await page.evaluate(() => {
    const messages = Array.from(
      document.querySelectorAll(".translatable-message")
    );
    return messages.length ? messages[messages.length - 1].textContent : null;
  });

  return lastMessage;
};

export default getLastTelegramMsg;
