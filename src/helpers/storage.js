//Other Libraries
import SecureLS from "secure-ls";
//Configuration
const ls = new SecureLS({
    isCompression: false,
    encodingType: 'des',
    encryptionSecret: 'Securitization'
});

export const storage = {
    set(attr, record) {
        ls.set(attr, record);
    },
    get(attr) {
        try {
            return ls.get(attr);
        } catch (error) {
            return null
        }
    },
    clear(attr) {
        ls.remove(attr);
    },
    clearAll() {
        ls.removeAll();
    }
}