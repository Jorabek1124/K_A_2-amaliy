/**
 * Vigenère Shifrlash Algoritmi
 * Polialfavitik shifrlash algoritmi
 */

export class Vigenere {
    /**
     * Kalit so'zni matn uzunligiga moslashtirish
     */
    static expandKey(key, length) {
        let expandedKey = '';
        for (let i = 0; i < length; i++) {
            expandedKey += key[i % key.length];
        }
        return expandedKey;
    }

    /**
     * Harfni raqamga o'tkazish (A=0, B=1, ..., Z=25)
     */
    static charToNumber(char) {
        const upperChar = char.toUpperCase();
        if (upperChar >= 'A' && upperChar <= 'Z') {
            return upperChar.charCodeAt(0) - 'A'.charCodeAt(0);
        }
        return null;
    }

    /**
     * Raqamni harfga o'tkazish
     */
    static numberToChar(number) {
        return String.fromCharCode((number % 26) + 'A'.charCodeAt(0));
    }

    /**
     * Matnni shifrlash
     */
    static encrypt(plaintext, key) {
        const upperPlaintext = plaintext.toUpperCase();
        const upperKey = key.toUpperCase();
        const expandedKey = this.expandKey(upperKey, upperPlaintext.length);
        let ciphertext = '';

        for (let i = 0; i < upperPlaintext.length; i++) {
            const plainChar = upperPlaintext[i];
            const keyChar = expandedKey[i];

            const plainNum = this.charToNumber(plainChar);
            const keyNum = this.charToNumber(keyChar);

            if (plainNum !== null && keyNum !== null) {
                // Shifrlash: (plaintext + key) mod 26
                const encryptedNum = (plainNum + keyNum) % 26;
                ciphertext += this.numberToChar(encryptedNum);
            } else {
                // Harf bo'lmagan belgilar o'zgartirilmaydi
                ciphertext += plainChar;
            }
        }

        return ciphertext;
    }

    /**
     * Shifrlangan matnni deshifrlash
     */
    static decrypt(ciphertext, key) {
        const upperCiphertext = ciphertext.toUpperCase();
        const upperKey = key.toUpperCase();
        const expandedKey = this.expandKey(upperKey, upperCiphertext.length);
        let plaintext = '';

        for (let i = 0; i < upperCiphertext.length; i++) {
            const cipherChar = upperCiphertext[i];
            const keyChar = expandedKey[i];

            const cipherNum = this.charToNumber(cipherChar);
            const keyNum = this.charToNumber(keyChar);

            if (cipherNum !== null && keyNum !== null) {
                // Deshifrlash: (ciphertext - key) mod 26
                const decryptedNum = (cipherNum - keyNum + 26) % 26;
                plaintext += this.numberToChar(decryptedNum);
            } else {
                // Harf bo'lmagan belgilar o'zgartirilmaydi
                plaintext += cipherChar;
            }
        }

        return plaintext;
    }

    /**
     * Kalit so'zni tozalash (faqat harflarni qoldirish)
     */
    static cleanKey(key) {
        return key.replace(/[^A-Za-z]/g, '').toUpperCase();
    }
}

