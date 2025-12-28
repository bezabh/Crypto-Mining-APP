
/**
 * PrimeMine AI - Official Telegram Bot
 * 
 * Instructions:
 * 1. Install dependencies: `npm install node-telegram-bot-api dotenv`
 * 2. Get a Token from @BotFather on Telegram
 * 3. Set TELEGRAM_BOT_TOKEN in your .env file
 * 4. Run: `node backend/telegramBot.js`
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Replace with your token from BotFather if not using .env
const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Mock Database for user sessions
const userSessions = new Map();

// --- Keyboards ---
const mainMenu = {
    reply_markup: {
        keyboard: [
            ['📊 My Balance', '⛏️ Mining Status'],
            ['⚙️ Settings', '❓ Help']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

const miningMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '▶️ Start Mining', callback_data: 'start_mining' }, { text: '⏹️ Stop Mining', callback_data: 'stop_mining' }],
            [{ text: '🔄 Change Coin', callback_data: 'change_coin' }]
        ]
    }
};

// --- Command Handlers ---

// /start - Entry point
bot.onText(/\/start(.+)?/, (msg, match) => {
    const chatId = msg.chat.id;
    const param = match[1] ? match[1].trim() : null;

    if (param) {
        // Handle Deep Linking (e.g., /start PM-1234)
        userSessions.set(chatId, { linked: true, webId: param });
        bot.sendMessage(chatId, `✅ **Successfully Connected!**\n\nYour Telegram account is now linked to PrimeMine Dashboard ID: \`${param}\`.\n\nYou can now manage your mining operations directly from here.`, { parse_mode: 'Markdown', ...mainMenu });
    } else {
        bot.sendMessage(chatId, `👋 **Welcome to PrimeMine AI Bot!**\n\nTo link your account, please go to the **Settings** tab in your Web Dashboard and click "Connect Telegram".\n\nOr use the menu below if already connected.`, { parse_mode: 'Markdown', ...mainMenu });
    }
});

// /balance or Button Click
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '📊 My Balance') {
        // Simulate fetching from DB
        const balance = (Math.random() * 0.5).toFixed(6);
        bot.sendMessage(chatId, `💰 **Wallet Balance**\n\n**Bitcoin:** ${balance} BTC\n**USD Value:** $${(balance * 65000).toFixed(2)}\n\n_Updated just now._`, { parse_mode: 'Markdown' });
    }

    if (text === '⛏️ Mining Status') {
        const hashrate = (85 + Math.random() * 10).toFixed(2);
        const temp = (65 + Math.random() * 5).toFixed(1);
        bot.sendMessage(chatId, `🖥️ **Rig Status: ONLINE**\n\n**Hashrate:** ${hashrate} TH/s\n**Temp:** ${temp}°C\n**Power:** 3200W\n\nAlgorithm: SHA-256 (Bitcoin)`, { parse_mode: 'Markdown', ...miningMenu });
    }

    if (text === '❓ Help') {
        bot.sendMessage(chatId, `🆘 **Support Commands**\n\n/start - Reconnect\n/balance - Check funds\n/status - Rig telemetry\n/stop - Emergency stop\n\nNeed human help? Contact @PrimeMineSupport.`);
    }
});

// Handle Inline Buttons (Start/Stop Mining)
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = message.chat.id;

    if (data === 'start_mining') {
        bot.answerCallbackQuery(callbackQuery.id, { text: 'Mining Started via Remote Command' });
        bot.sendMessage(chatId, '🚀 **Mining Initiated.** Optimizing AI algorithms...');
    } else if (data === 'stop_mining') {
        bot.answerCallbackQuery(callbackQuery.id, { text: 'Mining Stopped' });
        bot.sendMessage(chatId, '🛑 **Mining Stopped.** Rig entering cool-down mode.');
    } else if (data === 'change_coin') {
        bot.sendMessage(chatId, 'Select Coin to Mine:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Bitcoin (BTC)', callback_data: 'set_btc' }],
                    [{ text: 'Ethereum (ETHW)', callback_data: 'set_eth' }]
                ]
            }
        });
    }
});

console.log('PrimeMine AI Telegram Bot is running...');
