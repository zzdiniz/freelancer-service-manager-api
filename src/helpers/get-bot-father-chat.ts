import { Page } from "puppeteer";

const getBotFatherChat = async (page: Page): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await page.evaluate(() => {
        const subtitles = Array.from(
          document.querySelectorAll(
            ".search-group .chatlist .row .dialog-subtitle .row-subtitle"
          )
        );
        for (const subtitle of subtitles) {
          if (subtitle.textContent === "@BotFather") {
            const clickableTag = subtitle.closest("a");
            clickableTag?.classList.add("bot-father");
            return subtitle.textContent;
          }
        }
        return null;
      });

      if (result) {
        resolve(result);
      } else {
        reject("BotFather não encontrado");
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default getBotFatherChat;
