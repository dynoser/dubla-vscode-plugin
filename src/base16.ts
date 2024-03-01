/// <reference path="./custom.d.ts" />

export default class base16
{
    public static hexBase = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

    static decode(str: string): string {
        const uint8Arr = base16.hexToUint8Arr(str);
        return base16.Uint8ArrToTextUTF8(uint8Arr);
    }

    public static Uint8ArrToTextUTF8(Uint8Arr: Uint8Array): string {
        const textDecoder = new TextDecoder('utf-8');
        const utf8String = textDecoder.decode(Uint8Arr);
        return utf8String;
    }

    static encode(str: string): string {
        const uint8arr: Uint8Array = new Uint8Array(new TextEncoder().encode(str));
        return base16.Uint8ArrToHexStr(uint8arr);
    }

    static hexExplode(str: string): string[] {
        const hexArr: string[] = [];
        const l = str.length;
        const regex = /^[0-9a-fA-F]$/;
    
        for (let i = 0; i < l; i++) {
            const ch1 = str[i];
            
            if (regex.test(ch1)) {
                const ch2 = str[i + 1];
    
                if (regex.test(ch2)) {
                    hexArr.push(ch1 + ch2);
                    i++;
                } else {
                    hexArr.push('0' + ch1);
                }
            }
        }
        return hexArr;
    }
    
    static hexToUint8Arr(hexStr: string): Uint8Array {
        const hexArr: string[] = base16.hexExplode(hexStr);

        if (typeof Buffer !== 'undefined') {
            try {
                return Buffer.from(hexArr.join(''), 'hex');
            } catch (e: any) {
            }
        }

        if (!hexArr.length) {
            return new Uint8Array();
        }

        const bytesArr = hexArr.map(hx => parseInt(hx, 16));
        return new Uint8Array(bytesArr);
    }

    static Uint8ArrToHexStr(Uint8Arr: Uint8Array, glue: string = ''): string {
        const hexBase = base16.hexBase;
        const hexString = Array.from(Uint8Arr)
            .map(byte => 
                //byte.toString(16).padStart(2, '0')
                hexBase[byte >> 4] + hexBase[byte & 15]
            )
            .join(glue);
        return hexString;
    }
}