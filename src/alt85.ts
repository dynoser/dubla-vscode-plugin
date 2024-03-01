//import { TextDecoder, TextEncoder } from "util";
/// <reference path="./custom.d.ts" />

import AltBase64 from "./altbase64";
import base64alt from "./base64alt";
import vc85 from "./vc85";

let zlib: typeof import('zlib') = require('zlib');
const canZlib = zlib.hasOwnProperty('deflateSync');
let pako: typeof import('pako') = !canZlib ? require('pako') : undefined;
const canPako = !canZlib && pako.hasOwnProperty('deflate');

export default class alt85 {
    static gzEnabled = true;

    public static encode(data: string, useAlt85: boolean = true): string {

        let outUi8Arr: Uint8Array;
        const uint8arr = new Uint8Array(new TextEncoder().encode(data));
        if (useAlt85) {
            const len = uint8arr.length;
            const maxLen = 4 * len / 3;
            let num64arr = AltBase64.encodeBytes(uint8arr);
            if (num64arr.length < maxLen) {
                // successful encoded into AltBase64
                outUi8Arr = base64alt.Num64ArrToUint8Arr(num64arr, 51);
            } else {
                // encode in binary-mode with 49-low 6-bit AltBase64 prefix
                outUi8Arr = new Uint8Array(len + 1);
                outUi8Arr[0] = 196;
                outUi8Arr.set(uint8arr, 1);
            }
            if (alt85.gzEnabled && (canZlib || canPako)) {
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
        } else {
            outUi8Arr = uint8arr;
        }
        return vc85.encodeUint8Arr(outUi8Arr, useAlt85);
    }

    public static decode(data: string, alwaysUseAlt85: boolean = false): string {
        const outUi8Arr = alt85.decodeToUint8Arr(data, alwaysUseAlt85);
        const textDecoder = new TextDecoder('utf-8');
        return textDecoder.decode(outUi8Arr);        
    }

    public static decodeToUint8Arr(data: string, alwaysUseAlt85: boolean = false): Uint8Array {
        const uint8arr: Uint8Array = vc85.decodeToUint8Arr(data);
        if (!vc85.lastDecodedIsAlt85 && !alwaysUseAlt85) {
            return uint8arr;
        }
        const firstCharCode = uint8arr[0] ?? 0;
        switch(firstCharCode) {
            case 196: { // 49 << 2 + 0
                return uint8arr.slice(1);
            }
            case 197: { // 49 << 2 + 1
                return canZlib ? zlib.inflateRawSync(uint8arr.slice(1)) : pako.inflate(uint8arr.slice(1), {windowBits: -15});
            }
        }
        const num64arr: number[] = base64alt.Uint8ArrToNum64Arr(uint8arr);
        return AltBase64.decodeBytes(num64arr);
    }
}