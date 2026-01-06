/**
 * Caesar Shifrlash Algoritmi
 * Monoalfavitik shifrlash algoritmi
 */

export class Caesar {
    /**
     * Harfni raqamga o'tkazish
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
    static numberToChar(number, isUpperCase) {
        const base = isUpperCase ? 'A' : 'a';
        return String.fromCharCode((number % 26) + base.charCodeAt(0));
    }

    /**
     * Matnni shifrlash
     */
    static encrypt(plaintext, shift) {
        shift = shift % 26; // 26 ga modul
        let ciphertext = '';

        for (let i = 0; i < plaintext.length; i++) {
            const char = plaintext[i];
            const isUpperCase = char === char.toUpperCase();
            const charNum = this.charToNumber(char);

            if (charNum !== null) {
                // Shifrlash: (harf + shift) mod 26
                const encryptedNum = (charNum + shift) % 26;
                ciphertext += this.numberToChar(encryptedNum, isUpperCase);
            } else {
                // Harf bo'lmagan belgilar o'zgartirilmaydi
                ciphertext += char;
            }
        }

        return ciphertext;
    }

    /**
     * Shifrlangan matnni deshifrlash
     */
    static decrypt(ciphertext, shift) {
        shift = shift % 26; // 26 ga modul
        let plaintext = '';

        for (let i = 0; i < ciphertext.length; i++) {
            const char = ciphertext[i];
            const isUpperCase = char === char.toUpperCase();
            const charNum = this.charToNumber(char);

            if (charNum !== null) {
                // Deshifrlash: (harf - shift) mod 26
                const decryptedNum = (charNum - shift + 26) % 26;
                plaintext += this.numberToChar(decryptedNum, isUpperCase);
            } else {
                // Harf bo'lmagan belgilar o'zgartirilmaydi
                plaintext += char;
            }
        }

        return plaintext;
    }
}

