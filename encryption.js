const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

function normalizeChar(c) {
    const index = alphabet.indexOf(c.toUpperCase());
    return index >= 0 ? index : -1;
}

function denormalizeChar(n) {
    return alphabet[n % alphabet.length];
}

function generateShift(key, index) {
    return ((index * index) + (key * index) + key) % alphabet.length;
}

function encryptMessage() {
    const text = document.getElementById("plainText").value;
    const keyInput = document.getElementById("keyEncrypt").value;
    const out = document.getElementById("encryptedOutput");

    if (!keyInput || isNaN(keyInput)) {
        out.textContent = "Key bir sayı olmalıdır";
        return;
    }

    const key = Number(keyInput);
    let result = "";
    let index = 1;

    for (let c of text) {
        let base = normalizeChar(c);
        if (base >= 0) {
            let shift = generateShift(key, index);
            result += denormalizeChar(base + shift);
            index++;
        } else {
            result += c;
        }
    }

    out.textContent = result;
    generateQRCode(result);
}

function decryptMessage() {
    const text = document.getElementById("encryptedInput").value;
    const keyInput = document.getElementById("keyDecrypt").value;
    const out = document.getElementById("decryptedOutput");

    if (!keyInput || isNaN(keyInput)) {
        out.textContent = "Key bir sayı olmalıdır";
        return;
    }

    const key = Number(keyInput);
    let result = "";
    let index = 1;

    for (let c of text) {
        let base = normalizeChar(c);
        if (base >= 0) {
            let shift = generateShift(key, index);
            result += denormalizeChar(base - shift + alphabet.length);
            index++;
        } else {
            result += c;
        }
    }

    out.textContent = result;
}

function generateQRCode(text) {
    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: window.location.href + '?encrypted=' + encodeURIComponent(text),
        width: 260,
        height: 260,
        colorDark: "#00bfff",
        colorLight: "#00000000",
        correctLevel: QRCode.CorrectLevel.H  // yüksek hata düzeltme
    });
}

// URL parametrelerinden şifreli metni otomatik al ve decode paneline doldur
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const encrypted = params.get('encrypted');
    if (encrypted) {
        document.getElementById('encryptedInput').value = encrypted;
    }
});