import { Page } from "puppeteer";

const getTelegramQrCode = async (page: Page) => {
  await page.waitForSelector(".qr-canvas");
  const qrCodeDataUrl = await page.evaluate(() => {
    const canvas = document.querySelector(".qr-canvas") as HTMLCanvasElement;
    return canvas.toDataURL("image/png");
  });

  return qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
};

export default getTelegramQrCode;
