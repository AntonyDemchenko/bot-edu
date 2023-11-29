const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "6757128062:AAHQyXuO3u-oda6COeFvntWhRw2A8z-0e5Q";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

bot.setMyCommands([
  { command: "/info", description: "info" },
  { command: "/start", description: "start" },
  { command: "/game", description: "game" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `let's play!`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `let'a try!`, gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.from.username;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/8eb/10f/8eb10f4b-8f4f-4958-aa48-80e7af90470a/7.webp"
      );
      return await bot.sendMessage(chatId, "welcome!)");
    }
    if (text === "/info") {
      return await bot.sendMessage(chatId, `your username is ${userName}`);
    }
    if (text === "/game") {
      startGame(chatId);
    }
    // await bot.sendMessage(chatId, ` ${text} your text here`);
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

  if (data === "/again") {
    return startGame(chatId);
  }

  if (data == chats[chatId]) {
    await bot.sendMessage(chatId, `your number is ${data}`);
    return await bot.sendMessage(chatId, `you win!`, againOptions);
  }
  return await bot.sendMessage(
    chatId,
    `nope(, I choose number ${chats[chatId]}`,
    againOptions
  );
});

start();
