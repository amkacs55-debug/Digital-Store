const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// --- ТАНЫ ТОХИРГОО (TOKEN, ID, API KEY ОРУУЛСАН) ---
const TELEGRAM_TOKEN = '8686350962:AAE-qTC97YHESmKDHxxq3Zx7pCGgnNxhUVQ'; 
const SMMP_API_KEY = 'b1439d2855914a2bd1b17a3bc2228da8'; 
const ADMIN_ID = 7069407872; 

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

console.log("Digital Store Backend ажиллаж эхэллээ...");

// 1. RENDER-ИЙН ПОРТЫГ НЭЭХ ХЭСЭГ (Энэ код байхгүй бол Timed Out заана)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running properly!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// 2. ТЕЛЕГРАМ БОТНЫ ҮНДСЭН ЛОГИК
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (chatId === ADMIN_ID && text && text.includes('ЗАХИАЛГА:')) {
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ БАТЛАХ (API ИЛГЭЭХ)', callback_data: `approve_${text}` },
                        { text: '❌ ЦУЦЛАХ', callback_data: 'reject' }
                    ]
                ]
            }
        };
        bot.sendMessage(chatId, "🔔 Шинэ захиалга ирлээ. Төлбөр орсон бол БАТЛАХ дарна уу:", opts);
    } else if (chatId !== ADMIN_ID) {
        bot.sendMessage(chatId, "⚠️ Та энэ ботыг удирдах эрхгүй байна.");
    }
});

// 3. ТОВЧЛУУР ДАРАХ ҮЙЛДЭЛ
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (chatId !== ADMIN_ID) return;

    if (data.startsWith('approve_')) {
        bot.sendMessage(chatId, "🔄 SMMPixie рүү илгээж байна...");
        
        try {
            const content = data.replace('approve_ЗАХИАЛГА:', '').trim();
            const [serviceId, link, qty] = content.split('|').map(item => item.trim());

            if (!serviceId || !link || !qty) {
                return bot.sendMessage(chatId, "❌ Алдаа: Формат буруу байна. (ID | Link | Qty)");
            }

            const apiUrl = `https://smmpixie.com/api/v2?key=${SMMP_API_KEY}&action=add&service=${serviceId}&link=${encodeURIComponent(link)}&quantity=${qty}`;
            const response = await axios.post(apiUrl);

            if (response.data.order) {
                bot.editMessageText(`✅ АМЖИЛТТАЙ! \nSMMPixie ID: ${response.data.order}`, {
                    chat_id: chatId,
                    message_id: query.message.message_id
                });
            } else {
                bot.sendMessage(chatId, `❌ SMMPixie Алдаа: ${response.data.error}`);
            }
        } catch (error) {
            bot.sendMessage(chatId, "❌ Холболтын алдаа гарлаа.");
        }
    } else if (data === 'reject') {
        bot.editMessageText("❌ Захиалгыг цуцаллаа.", {
            chat_id: chatId,
            message_id: query.message.message_id
        });
    }
});
