export class Base64 {
    static encode(b: string) {
        const buff = Buffer.from(b, 'ascii')
        const base64data = buff.toString('base64')
        return base64data
    }

    static decode(code: string) {
        const buff = Buffer.from(code, 'base64');
        return Uint8Array.from(buff)
    }

    static hexToBytes(hex: any) {
        let bytes = []
        for (let c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }

    static bytesToHex(bytes: any) {
        let hex = []
        for (let i = 0; i < bytes.length; i++) {
            let current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }

}
