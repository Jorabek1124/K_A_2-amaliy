/**
 * RSA Shifrlash Algoritmi
 * Asimmetrik shifrlash algoritmi
 */

export class RSA {
    /**
     * GCD (Eng katta umumiy bo'luvchi) topish
     */
    static gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Modul inversiyani topish (Extended Euclidean Algorithm)
     */
    static modInverse(a, m) {
        let [oldR, r] = [a, m];
        let [oldS, s] = [1, 0];

        while (r !== 0) {
            const quotient = Math.floor(oldR / r);
            [oldR, r] = [r, oldR - quotient * r];
            [oldS, s] = [s, oldS - quotient * s];
        }

        if (oldR > 1) return null; // Inverse mavjud emas
        return ((oldS % m) + m) % m;
    }

    /**
     * Tez modul darajasi (Fast Modular Exponentiation)
     */
    static modPow(base, exp, mod) {
        let result = 1n;
        base = BigInt(base) % BigInt(mod);
        exp = BigInt(exp);

        while (exp > 0) {
            if (exp % 2n === 1n) {
                result = (result * base) % BigInt(mod);
            }
            exp = exp >> 1n;
            base = (base * base) % BigInt(mod);
        }
        return Number(result);
    }

    /**
     * Eyler funksiyasi φ(n) = (p-1)(q-1)
     */
    static eulerTotient(p, q) {
        return (p - 1) * (q - 1);
    }

    /**
     * Ochiq kalit (e) topish
     */
    static findPublicKey(phi) {
        // e ni topish: 1 < e < phi va gcd(e, phi) = 1
        for (let e = 2; e < phi; e++) {
            if (this.gcd(e, phi) === 1) {
                return e;
            }
        }
        return null;
    }

    /**
     * Kalitlar yaratish
     */
    static generateKeys(p, q) {
        if (p === q) {
            throw new Error('P va Q bir xil bo\'lishi mumkin emas');
        }

        const n = p * q;
        const phi = this.eulerTotient(p, q);
        const e = this.findPublicKey(phi);
        
        if (!e) {
            throw new Error('Ochiq kalit topilmadi');
        }

        const d = this.modInverse(e, phi);
        
        if (!d) {
            throw new Error('Yopiq kalit topilmadi');
        }

        return {
            publicKey: { e, n },
            privateKey: { d, n },
            p,
            q,
            phi
        };
    }

    /**
     * Matnni shifrlash
     */
    static encrypt(message, publicKey) {
        const { e, n } = publicKey;
        const encrypted = [];

        for (let i = 0; i < message.length; i++) {
            const charCode = message.charCodeAt(i);
            const encryptedChar = this.modPow(charCode, e, n);
            encrypted.push(encryptedChar);
        }

        return encrypted.join(',');
    }

    /**
     * Shifrlangan matnni deshifrlash
     */
    static decrypt(encryptedMessage, privateKey) {
        const { d, n } = privateKey;
        const encryptedArray = encryptedMessage.split(',').map(Number);
        let decrypted = '';

        for (let i = 0; i < encryptedArray.length; i++) {
            const decryptedCharCode = this.modPow(encryptedArray[i], d, n);
            decrypted += String.fromCharCode(decryptedCharCode);
        }

        return decrypted;
    }

    /**
     * Kalitlarni formatlash
     */
    static formatKey(key) {
        return `(${key.e || key.d}, ${key.n})`;
    }
}

