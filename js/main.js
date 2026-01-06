/**
 * Asosiy JavaScript fayli
 * UI boshqaruvi va algoritmlar bilan integratsiya
 */

import { RSA } from './algorithms/rsa.js';
import { Vigenere } from './algorithms/vigenere.js';
import { Caesar } from './algorithms/caesar.js';
import { Base64 } from './algorithms/base64.js';

// Global o'zgaruvchilar
let rsaKeys = null;

/**
 * Tab boshqaruvi
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.algorithm-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const algorithm = button.getAttribute('data-algorithm');

            // Barcha tab va sectionlarni yopish
            tabButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Tanlangan tab va sectionni ochish
            button.classList.add('active');
            document.getElementById(`${algorithm}-section`).classList.add('active');
        });
    });
}

/**
 * RSA algoritmi uchun event listenerlar
 */
function initRSA() {
    const generateBtn = document.getElementById('rsa-generate-keys');
    const encryptBtn = document.getElementById('rsa-encrypt');
    const decryptBtn = document.getElementById('rsa-decrypt');
    const pInput = document.getElementById('rsa-p');
    const qInput = document.getElementById('rsa-q');
    const publicKeyTextarea = document.getElementById('rsa-public-key');
    const privateKeyTextarea = document.getElementById('rsa-private-key');
    const plaintextTextarea = document.getElementById('rsa-plaintext');
    const ciphertextTextarea = document.getElementById('rsa-ciphertext');
    const decryptedTextarea = document.getElementById('rsa-decrypted');

    // Kalitlar yaratish
    generateBtn.addEventListener('click', () => {
        try {
            const p = parseInt(pInput.value);
            const q = parseInt(qInput.value);

            if (p < 2 || q < 2) {
                alert('P va Q 2 dan katta bo\'lishi kerak');
                return;
            }

            if (p === q) {
                alert('P va Q bir xil bo\'lishi mumkin emas');
                return;
            }

            rsaKeys = RSA.generateKeys(p, q);
            publicKeyTextarea.value = RSA.formatKey(rsaKeys.publicKey);
            privateKeyTextarea.value = RSA.formatKey(rsaKeys.privateKey);

            // Kalitlar yaratish hisoblarini ko'rsatish
            showRSAGenerationSteps(p, q, rsaKeys);

            // Ma'lumotlarni tozalash
            plaintextTextarea.value = '';
            ciphertextTextarea.value = '';
            decryptedTextarea.value = '';

            alert('Kalitlar muvaffaqiyatli yaratildi!');
        } catch (error) {
            alert('Xatolik: ' + error.message);
        }
    });

    // Shifrlash
    encryptBtn.addEventListener('click', () => {
        if (!rsaKeys) {
            alert('Avval kalitlarni yarating!');
            return;
        }

        const plaintext = plaintextTextarea.value;
        if (!plaintext.trim()) {
            alert('Matn kiriting!');
            return;
        }

        try {
            const encrypted = RSA.encrypt(plaintext, rsaKeys.publicKey);
            ciphertextTextarea.value = encrypted;
            decryptedTextarea.value = '';
            
            // Hisoblash jarayonini ko'rsatish
            showRSAEncryptionSteps(plaintext, encrypted, rsaKeys.publicKey);
        } catch (error) {
            alert('Shifrlashda xatolik: ' + error.message);
        }
    });

    // Deshifrlash
    decryptBtn.addEventListener('click', () => {
        if (!rsaKeys) {
            alert('Avval kalitlarni yarating!');
            return;
        }

        const ciphertext = ciphertextTextarea.value;
        if (!ciphertext.trim()) {
            alert('Shifrlangan matn kiriting!');
            return;
        }

        try {
            const decrypted = RSA.decrypt(ciphertext, rsaKeys.privateKey);
            decryptedTextarea.value = decrypted;
            
            // Hisoblash jarayonini ko'rsatish
            showRSADecryptionSteps(ciphertext, decrypted, rsaKeys.privateKey);
        } catch (error) {
            alert('Deshifrlashda xatolik: ' + error.message);
        }
    });
}

/**
 * Vigenère algoritmi uchun event listenerlar
 */
function initVigenere() {
    const encryptBtn = document.getElementById('vigenere-encrypt');
    const decryptBtn = document.getElementById('vigenere-decrypt');
    const keyInput = document.getElementById('vigenere-key');
    const plaintextTextarea = document.getElementById('vigenere-plaintext');
    const ciphertextTextarea = document.getElementById('vigenere-ciphertext');
    const decryptedTextarea = document.getElementById('vigenere-decrypted');

    // Shifrlash
    encryptBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        const plaintext = plaintextTextarea.value.trim();

        if (!key) {
            alert('Kalit so\'zni kiriting!');
            return;
        }

        if (!plaintext) {
            alert('Matn kiriting!');
            return;
        }

        try {
            const cleanedKey = Vigenere.cleanKey(key);
            if (!cleanedKey) {
                alert('Kalit so\'zda kamida bitta harf bo\'lishi kerak!');
                return;
            }

            const encrypted = Vigenere.encrypt(plaintext, cleanedKey);
            ciphertextTextarea.value = encrypted;
            decryptedTextarea.value = '';
            
            // Hisoblash jarayonini ko'rsatish
            showVigenereEncryptionSteps(plaintext, encrypted, cleanedKey);
        } catch (error) {
            alert('Shifrlashda xatolik: ' + error.message);
        }
    });

    // Deshifrlash
    decryptBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        const ciphertext = ciphertextTextarea.value.trim();

        if (!key) {
            alert('Kalit so\'zni kiriting!');
            return;
        }

        if (!ciphertext) {
            alert('Shifrlangan matn kiriting!');
            return;
        }

        try {
            const cleanedKey = Vigenere.cleanKey(key);
            if (!cleanedKey) {
                alert('Kalit so\'zda kamida bitta harf bo\'lishi kerak!');
                return;
            }

            const decrypted = Vigenere.decrypt(ciphertext, cleanedKey);
            decryptedTextarea.value = decrypted;
            
            // Hisoblash jarayonini ko'rsatish
            showVigenereDecryptionSteps(ciphertext, decrypted, cleanedKey);
        } catch (error) {
            alert('Deshifrlashda xatolik: ' + error.message);
        }
    });
}

/**
 * Caesar algoritmi uchun event listenerlar
 */
function initCaesar() {
    const encryptBtn = document.getElementById('caesar-encrypt');
    const decryptBtn = document.getElementById('caesar-decrypt');
    const shiftInput = document.getElementById('caesar-shift');
    const plaintextTextarea = document.getElementById('caesar-plaintext');
    const ciphertextTextarea = document.getElementById('caesar-ciphertext');
    const decryptedTextarea = document.getElementById('caesar-decrypted');

    // Shifrlash
    encryptBtn.addEventListener('click', () => {
        const shift = parseInt(shiftInput.value);
        const plaintext = plaintextTextarea.value;

        if (isNaN(shift) || shift < 1 || shift > 25) {
            alert('Siljish 1 dan 25 gacha bo\'lishi kerak!');
            return;
        }

        if (!plaintext.trim()) {
            alert('Matn kiriting!');
            return;
        }

        try {
            const encrypted = Caesar.encrypt(plaintext, shift);
            ciphertextTextarea.value = encrypted;
            decryptedTextarea.value = '';
            
            // Hisoblash jarayonini ko'rsatish
            showCaesarEncryptionSteps(plaintext, encrypted, shift);
        } catch (error) {
            alert('Shifrlashda xatolik: ' + error.message);
        }
    });

    // Deshifrlash
    decryptBtn.addEventListener('click', () => {
        const shift = parseInt(shiftInput.value);
        const ciphertext = ciphertextTextarea.value;

        if (isNaN(shift) || shift < 1 || shift > 25) {
            alert('Siljish 1 dan 25 gacha bo\'lishi kerak!');
            return;
        }

        if (!ciphertext.trim()) {
            alert('Shifrlangan matn kiriting!');
            return;
        }

        try {
            const decrypted = Caesar.decrypt(ciphertext, shift);
            decryptedTextarea.value = decrypted;
            
            // Hisoblash jarayonini ko'rsatish
            showCaesarDecryptionSteps(ciphertext, decrypted, shift);
        } catch (error) {
            alert('Deshifrlashda xatolik: ' + error.message);
        }
    });
}

/**
 * Base64 algoritmi uchun event listenerlar
 */
function initBase64() {
    const encodeBtn = document.getElementById('base64-encode');
    const decodeBtn = document.getElementById('base64-decode');
    const plaintextTextarea = document.getElementById('base64-plaintext');
    const encodedTextarea = document.getElementById('base64-encoded');
    const decodedTextarea = document.getElementById('base64-decoded');

    // Kodlash
    encodeBtn.addEventListener('click', () => {
        const plaintext = plaintextTextarea.value;

        if (!plaintext.trim()) {
            alert('Matn kiriting!');
            return;
        }

        try {
            const encoded = Base64.encode(plaintext);
            encodedTextarea.value = encoded;
            decodedTextarea.value = '';
        } catch (error) {
            alert('Kodlashda xatolik: ' + error.message);
        }
    });

    // Dekodlash
    decodeBtn.addEventListener('click', () => {
        const encoded = encodedTextarea.value.trim();

        if (!encoded) {
            alert('Kodlangan matn kiriting!');
            return;
        }

        try {
            const decoded = Base64.decode(encoded);
            decodedTextarea.value = decoded;
        } catch (error) {
            alert('Dekodlashda xatolik: ' + error.message);
        }
    });
}

/**
 * RSA kalitlar yaratish hisoblarini ko'rsatish
 */
function showRSAGenerationSteps(p, q, keys) {
    const calcDisplay = document.getElementById('rsa-calculations');
    const calcContent = document.getElementById('rsa-calc-content');
    
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    calcContent.innerHTML = `
        <div class="calc-step">
            <strong>1-qadam:</strong> n = P × Q = ${p} × ${q} = ${n}
        </div>
        <div class="calc-step">
            <strong>2-qadam:</strong> φ(n) = (P-1) × (Q-1) = ${p-1} × ${q-1} = ${phi}
        </div>
        <div class="calc-step">
            <strong>3-qadam:</strong> Ochiq kalit (e) = ${keys.publicKey.e} (gcd(${keys.publicKey.e}, ${phi}) = 1)
        </div>
        <div class="calc-step">
            <strong>4-qadam:</strong> Yopiq kalit (d) = ${keys.privateKey.d} (${keys.privateKey.d} × ${keys.publicKey.e} ≡ 1 mod ${phi})
        </div>
        <div class="calc-step">
            <strong>Ochiq kalit:</strong> (${keys.publicKey.e}, ${n})
        </div>
        <div class="calc-step">
            <strong>Yopiq kalit:</strong> (${keys.privateKey.d}, ${n})
        </div>
    `;
    
    calcDisplay.style.display = 'block';
}

/**
 * RSA shifrlash hisoblarini ko'rsatish
 */
function showRSAEncryptionSteps(plaintext, encrypted, publicKey) {
    const calcDisplay = document.getElementById('rsa-calculations');
    const calcContent = document.getElementById('rsa-calc-content');
    
    let steps = '<strong>Shifrlash jarayoni:</strong><br>';
    const encryptedArray = encrypted.split(',');
    
    for (let i = 0; i < Math.min(plaintext.length, 5); i++) {
        const char = plaintext[i];
        const charCode = char.charCodeAt(0);
        const encryptedValue = encryptedArray[i];
        steps += `
            <div class="calc-step">
                <strong>${char}</strong> (ASCII: ${charCode}) → 
                C = ${charCode}<sup>${publicKey.e}</sup> mod ${publicKey.n} = ${encryptedValue}
            </div>
        `;
    }
    
    if (plaintext.length > 5) {
        steps += `<div class="calc-step">... va ${plaintext.length - 5} ta belgi yana</div>`;
    }
    
    calcContent.innerHTML = steps;
    calcDisplay.style.display = 'block';
}

/**
 * RSA deshifrlash hisoblarini ko'rsatish
 */
function showRSADecryptionSteps(ciphertext, decrypted, privateKey) {
    const calcDisplay = document.getElementById('rsa-calculations');
    const calcContent = document.getElementById('rsa-calc-content');
    
    const encryptedArray = ciphertext.split(',');
    let steps = '<strong>Deshifrlash jarayoni:</strong><br>';
    
    for (let i = 0; i < Math.min(decrypted.length, 5); i++) {
        const char = decrypted[i];
        const charCode = char.charCodeAt(0);
        const encryptedValue = encryptedArray[i];
        steps += `
            <div class="calc-step">
                ${encryptedValue} → 
                M = ${encryptedValue}<sup>${privateKey.d}</sup> mod ${privateKey.n} = ${charCode} → 
                <strong>${char}</strong>
            </div>
        `;
    }
    
    if (decrypted.length > 5) {
        steps += `<div class="calc-step">... va ${decrypted.length - 5} ta belgi yana</div>`;
    }
    
    calcContent.innerHTML = steps;
    calcDisplay.style.display = 'block';
}

/**
 * Vigenère shifrlash hisoblarini ko'rsatish
 */
function showVigenereEncryptionSteps(plaintext, encrypted, key) {
    const calcDisplay = document.getElementById('vigenere-calculations');
    const calcContent = document.getElementById('vigenere-calc-content');
    
    const upperPlaintext = plaintext.toUpperCase();
    const upperKey = key.toUpperCase();
    const expandedKey = Vigenere.expandKey(upperKey, upperPlaintext.length);
    
    let steps = '<strong>Shifrlash jarayoni:</strong><br>';
    steps += `<div class="calc-step">Kalit so'z: <strong>${key}</strong> → Kengaytirilgan: <strong>${expandedKey}</strong></div>`;
    
    for (let i = 0; i < Math.min(plaintext.length, 10); i++) {
        const plainChar = upperPlaintext[i];
        const keyChar = expandedKey[i];
        const plainNum = Vigenere.charToNumber(plainChar);
        const keyNum = Vigenere.charToNumber(keyChar);
        
        if (plainNum !== null && keyNum !== null) {
            const encryptedNum = (plainNum + keyNum) % 26;
            const encryptedChar = Vigenere.numberToChar(encryptedNum);
            steps += `
                <div class="calc-step">
                    <strong>${plainChar}</strong> (${plainNum}) + ${keyChar} (${keyNum}) = ${plainNum + keyNum} mod 26 = ${encryptedNum} → <strong>${encryptedChar}</strong>
                </div>
            `;
        }
    }
    
    if (plaintext.length > 10) {
        steps += `<div class="calc-step">... va ${plaintext.length - 10} ta belgi yana</div>`;
    }
    
    calcContent.innerHTML = steps;
    calcDisplay.style.display = 'block';
}

/**
 * Vigenère deshifrlash hisoblarini ko'rsatish
 */
function showVigenereDecryptionSteps(ciphertext, decrypted, key) {
    const calcDisplay = document.getElementById('vigenere-calculations');
    const calcContent = document.getElementById('vigenere-calc-content');
    
    const upperCiphertext = ciphertext.toUpperCase();
    const upperKey = key.toUpperCase();
    const expandedKey = Vigenere.expandKey(upperKey, upperCiphertext.length);
    
    let steps = '<strong>Deshifrlash jarayoni:</strong><br>';
    steps += `<div class="calc-step">Kalit so'z: <strong>${key}</strong> → Kengaytirilgan: <strong>${expandedKey}</strong></div>`;
    
    for (let i = 0; i < Math.min(ciphertext.length, 10); i++) {
        const cipherChar = upperCiphertext[i];
        const keyChar = expandedKey[i];
        const cipherNum = Vigenere.charToNumber(cipherChar);
        const keyNum = Vigenere.charToNumber(keyChar);
        
        if (cipherNum !== null && keyNum !== null) {
            const decryptedNum = (cipherNum - keyNum + 26) % 26;
            const decryptedChar = Vigenere.numberToChar(decryptedNum);
            steps += `
                <div class="calc-step">
                    <strong>${cipherChar}</strong> (${cipherNum}) - ${keyChar} (${keyNum}) = ${cipherNum - keyNum + 26} mod 26 = ${decryptedNum} → <strong>${decryptedChar}</strong>
                </div>
            `;
        }
    }
    
    if (ciphertext.length > 10) {
        steps += `<div class="calc-step">... va ${ciphertext.length - 10} ta belgi yana</div>`;
    }
    
    calcContent.innerHTML = steps;
    calcDisplay.style.display = 'block';
}

/**
 * Caesar shifrlash hisoblarini ko'rsatish
 */
function showCaesarEncryptionSteps(plaintext, encrypted, shift) {
    const calcDisplay = document.getElementById('caesar-calculations');
    const calcContent = document.getElementById('caesar-calc-content');
    
    let steps = '<strong>Shifrlash jarayoni (shift = ' + shift + '):</strong><br>';
    
    for (let i = 0; i < Math.min(plaintext.length, 15); i++) {
        const char = plaintext[i];
        const isUpperCase = char === char.toUpperCase();
        const charNum = Caesar.charToNumber(char);
        
        if (charNum !== null) {
            const encryptedNum = (charNum + shift) % 26;
            const encryptedChar = Caesar.numberToChar(encryptedNum, isUpperCase);
            steps += `
                <div class="calc-step">
                    <strong>${char}</strong> (${charNum}) + ${shift} = ${charNum + shift} mod 26 = ${encryptedNum} → <strong>${encryptedChar}</strong>
                </div>
            `;
        } else {
            steps += `<div class="calc-step"><strong>${char}</strong> (harf emas, o'zgartirilmaydi)</div>`;
        }
    }
    
    if (plaintext.length > 15) {
        steps += `<div class="calc-step">... va ${plaintext.length - 15} ta belgi yana</div>`;
    }
    
    calcContent.innerHTML = steps;
    calcDisplay.style.display = 'block';
}

/**
 * Caesar deshifrlash hisoblarini ko'rsatish
 */
function showCaesarDecryptionSteps(ciphertext, decrypted, shift) {
    const calcDisplay = document.getElementById('caesar-calculations');
    const calcContent = document.getElementById('caesar-calc-content');
    
    let steps = '<strong>Deshifrlash jarayoni (shift = ' + shift + '):</strong><br>';
    
    for (let i = 0; i < Math.min(ciphertext.length, 15); i++) {
        const char = ciphertext[i];
        const isUpperCase = char === char.toUpperCase();
        const charNum = Caesar.charToNumber(char);
        
        if (charNum !== null) {
            const decryptedNum = (charNum - shift + 26) % 26;
            const decryptedChar = Caesar.numberToChar(decryptedNum, isUpperCase);
            steps += `
                <div class="calc-step">
                    <strong>${char}</strong> (${charNum}) - ${shift} = ${charNum - shift + 26} mod 26 = ${decryptedNum} → <strong>${decryptedChar}</strong>
                </div>
            `;
        } else {
            steps += `<div class="calc-step"><strong>${char}</strong> (harf emas, o'zgartirilmaydi)</div>`;
        }
    }
    
    if (ciphertext.length > 15) {
        steps += `<div class="calc-step">... va ${ciphertext.length - 15} ta belgi yana</div>`;
    }
    
    calcContent.innerHTML = steps;
    calcDisplay.style.display = 'block';
}

/**
 * Dasturni ishga tushirish
 */
function init() {
    initTabs();
    initRSA();
    initVigenere();
    initCaesar();
    initBase64();

    console.log('Klassik Shifrlash Algoritmlari dasturi yuklandi!');
}

// DOM yuklanganda dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', init);

