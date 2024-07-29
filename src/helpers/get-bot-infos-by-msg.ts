const getBotInfosByMsg = (message: string) => {
  const botLinkMatch = message.match(/t\.me\/([a-zA-Z0-9_]+)/);
  const tokenMatch = message.match(/(\d+:[a-zA-Z0-9_-]+)/);

  if (botLinkMatch && tokenMatch) {
    return {
      botLink: `https://t.me/${botLinkMatch[1]}`,
      botToken: tokenMatch[1],
    };
  }

  return null;
};

export default getBotInfosByMsg;
