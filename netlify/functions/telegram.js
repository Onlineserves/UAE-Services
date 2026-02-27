const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const data = JSON.parse(event.body);
    const { message, isUpdate, messageId } = data;

    // استدعاء المفاتيح السرية من إعدادات نيتليفاي (.env)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing environment variables' }) };
    }

    // تحديد ما إذا كنا نرسل رسالة جديدة أم نحدث رسالة سابقة (Edit Message)
    const url = isUpdate && messageId
        ? `https://api.telegram.org/bot${botToken}/editMessageText`
        : `https://api.telegram.org/bot${botToken}/sendMessage`;

    const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
    };

    if (isUpdate && messageId) {
        payload.message_id = messageId;
    }

    const response = await axios.post(url, payload);

    // إعادة النتيجة (مرفقة بـ message_id) للواجهة الأمامية
    return {
        statusCode: 200,
        body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error('Telegram API Error:', error.message);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send message' })
    };
  }
};