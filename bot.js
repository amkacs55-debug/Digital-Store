const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// --- ТОХИРГОО ---
const TELEGRAM_TOKEN = '8686350962:AAE-qTC97YHESmKDHxxq3Zx7pCGgnNxhUVQ'; 
const SMMP_API_KEY = 'b1439d2855914a2bd1b17a3bc2228da8'; 
const ADMIN_ID = 7069407872; // Зөвхөн таны ID-гаас ирсэн тушаалыг биелүүлнэ

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

console.log("Digital Store Backend ажиллаж эхэллээ...");

// Захиалгын мэдээлэл ирэхэд товчлуур харуулах
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Зөвхөн танаас ирсэн болон "ЗАХИАЛГА:" гэсэн үгтэй мессежийг шалгана
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
        // Хэрэв өөр хүн бот руу бичвэл хариу өгөхгүй эсвэл анхааруулга өгнө
        bot.sendMessage(chatId, "⚠️ Та энэ ботыг удирдах эрхгүй байна.");
    }
});

// Товчлуур дарах үйлдэл
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Зөвхөн админ товчлуур дээр дарж чадна
    if (chatId !== ADMIN_ID) return;

    if (data.startsWith('approve_')) {
        bot.sendMessage(chatId, "🔄 SMMPixie рүү илгээж байна...");
        
        try {
            // Мессежний форматаас өгөгдлийг салгаж авах
            // Формат: "ЗАХИАЛГА: ҮйлчилгээнийID | Линк | ТооШирхэг" байх ёстой
            const content = data.replace('approve_ЗАХИАЛГА:', '').trim();
            const [serviceId, link, qty] = content.split('|').map(item => item.trim());

            if (!serviceId || !link || !qty) {
                return bot.sendMessage(chatId, "❌ Алдаа: Мессежний формат буруу байна. (ID | Link | Qty байх ёстой)");
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
            bot.sendMessage(chatId, "❌ Холболтын алдаа эсвэл API буруу байна.");
            console.error(error);
        }
    } else if (data === 'reject') {
        bot.editMessageText("❌ Захиалгыг цуцаллаа.", {
            chat_id: chatId,
            message_id: query.message.message_id
        });
    }
});
// Render дээр ажиллуулахын тулд заавал байх ёстой Port тохиргоо
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bot is running...');
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});


