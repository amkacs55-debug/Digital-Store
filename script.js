// Үйлчилгээний ID-г өөрийнхөөрөө тааруулж авна (Жишээ нь: 102)
const serviceId = "102"; 
const link = document.getElementById('linkInput').value; // Линк авдаг ID
const quantity = document.getElementById('quantityInput').value; // Тоо авдаг ID

// МЕССЕЖИЙН ФОРМАТ - ЭНЭ МАШ ЧУХАЛ!
const message = `ЗАХИАЛГА: ${serviceId} | ${link} | ${quantity}`;

// Telegram API руу илгээх хэсэг
const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        chat_id: ADMIN_ID, // Чиний ID: 7069407872
        text: message
    })
});
