/**
 * Base64 Kodlash
 * Matnni Base64 formatiga kodlash va dekodlash
 */

export class Base64 {
    /**
     * Matnni Base64 ga kodlash
     */
    static encode(plaintext) {
        try {
            // Brauzerning o'rnatilgan funksiyasidan foydalanish
            // Unicode belgilar uchun to'g'ri ishlash uchun
            const utf8Text = unescape(encodeURIComponent(plaintext));
            return btoa(utf8Text);
        } catch (error) {
            throw new Error('Kodlashda xatolik: ' + error.message);
        }
    }

    /**
     * Base64 dan matnga dekodlash
     */
    static decode(encodedText) {
        try {
            // Base64 dan matnga o'tkazish
            const decoded = atob(encodedText);
            // Unicode belgilarni to'g'ri qaytarish
            return decodeURIComponent(escape(decoded));
        } catch (error) {
            throw new Error('Dekodlashda xatolik: ' + error.message);
        }
    }
}

