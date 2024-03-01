/// <reference path="./custom.d.ts" />

import AltBase64 from "./altbase64";
import base64alt from "./base64alt";
import dublaRaw from "./dublaRaw";

let zlib: typeof import('zlib') = require('zlib');
const canZlib = zlib.hasOwnProperty('deflateSync');
let pako: typeof import('pako') = !canZlib ? require('pako') : undefined;
const canPako = !canZlib && pako.hasOwnProperty('deflate');

export default class dubla extends dublaRaw{

    static gzEnabled = true;

    public static encode(data: string): string {

        const uint8arr = new Uint8Array(new TextEncoder().encode(data));
        const len = uint8arr.length;
        const maxLen = 4 * len / 3;
        let num64arr = AltBase64.encodeBytes(uint8arr);
        let outUi8Arr: Uint8Array;
        if (num64arr.length < maxLen) {
            // successful encoded into AltBase64
            outUi8Arr = base64alt.Num64ArrToUint8Arr(num64arr, 51);
        } else {
            // encode in binary-mode with 49-low 6-bit AltBase64 prefix
            outUi8Arr = new Uint8Array(len + 1);
            outUi8Arr[0] = 196;
            outUi8Arr.set(uint8arr, 1);
        }
        if (dubla.gzEnabled && (canZlib || canPako)) {
            const noGzLen = outUi8Arr.length;
            const tmpGzBuff = canZlib ? zlib.deflateRawSync(uint8arr, {
                level: zlib.constants.Z_BEST_COMPRESSION
            }) : pako.deflate(uint8arr, { level: 9, windowBits: -15 });

            if (tmpGzBuff && tmpGzBuff.length < noGzLen) {
                outUi8Arr = new Uint8Array(tmpGzBuff.length + 1);
                outUi8Arr[0] = 197;
                outUi8Arr.set(tmpGzBuff, 1);
            }
        }
        return dublaRaw.encodeBytes(outUi8Arr);
    }

    public static decode(data: string): string {
        const outUi8Arr = dubla.decodeToUint8Arr(data);
        const textDecoder = new TextDecoder('utf-8');
        return textDecoder.decode(outUi8Arr);        
    }

    public static decodeToUint8Arr(data: string): Uint8Array {
        const uint8arr: Uint8Array = dublaRaw.decodeBytes(data);
        const firstCharCode = uint8arr[0] ?? 0;
        switch(firstCharCode) {
            case 196: { // 49 << 2 + 0
                return uint8arr.slice(1);
            }
            case 197: { // 49 << 2 + 1
                return canZlib ? zlib.inflateRawSync(uint8arr.slice(1)) : pako.inflate(uint8arr.slice(1), {windowBits: -15});
            }
            default: {
                const num64arr: number[] = base64alt.Uint8ArrToNum64Arr(uint8arr);
                return AltBase64.decodeBytes(num64arr);
            }
        }
    }
}