/// <reference path="./custom.d.ts" />

export default class vc128 {
    public static vc128enc: string[] = []; // [int num128] => string (1 char utf-8)
    public static vc128dec: Record<number, number> = {}; // [int char-code] => int num 0-127

    // encoder options:
    public static currentEncodeMode: number = 0;
    public static splitWidth: number = 80; // split result to lines by width
    public static addPf: boolean = true; // add `{ ... } or not

    /**
     * (Optional)
     * The constructor is used only to set parameters.
     * if null is passed then the default-value is used
     * for example, call "new vc128(2);" will set encodeMode = 2
     *
     * @param encodeMode null 1 or 2 (default = 2)
     * @param splitWidth null or split width (default = 75)
     * @param addPf null or true or false (default = true)
     */
    public constructor(encodeMode: number | null = null, splitWidth: number | null = null, addPf: boolean | null = null) {
        if (typeof encodeMode === 'number') {
            vc128.init(encodeMode);
        }
        if (typeof splitWidth === 'number') {
            vc128.splitWidth = Math.floor(splitWidth);
        }
        if (addPf !== null) {
            vc128.addPf = !!addPf;
        }
    }

    /**
     * encodeMode:
     *  2 (default) - encode to utf-8  (1 or 2 bytes per char)
     *  1           - encode to cp1251 (1 byte per char)
     * @param encodeMode 2 or 1
     */
    public static init(encodeMode: number = 0): void {
        encodeMode = encodeMode || (vc128.currentEncodeMode ? vc128.currentEncodeMode : 2);

        if (vc128.currentEncodeMode === encodeMode) {
            return;
        }

        let repc: number = 118; // replaces: "=>v '=>w \=>x
        for (let i = 0; i < 85; i++) {
            let cn = [1, 6, 58, 59, 60].includes(i) ? repc++ : (33 + i);
            vc128.vc128dec[cn] = i;
            vc128.vc128enc[i] = String.fromCharCode(cn);
        }

        // replacement table: first char = from, second char = to.
        const repCharStr: string = 'БвГгДдЖжзИиЙйкЛлмнПтУФфЦцЧчШшЩщЪъЫыьЭэЮюЯя|';
        // add windows-cp1251 char table
        const cp1251Arr = [193,226,195,227,196,228,198,230,231,200,232,201,233,234,203,235,236,237,207,242,211,212,244,214,246,215,247,216,248,217,249,218,250,219,251,252,221,253,222,254,223,255,0];

        for (let i = 85; i < 128; i++) {
            const p = i - 85;
            let charEnc: string = repCharStr[p];
            let cnu: number = charEnc.charCodeAt(0);
            const cp1251num: number = cp1251Arr[p];

            vc128.vc128dec[cnu] = i;

            // convert unicode char-number to utf-8 second byte number
            if (cnu > 1088) { //d1 xx
                cnu -= 960;
            } else if (cnu > 1024) { //d0 xx
                cnu -= 896;
            }
            vc128.vc128dec[cnu] = i;

            if (cp1251num) {
                vc128.vc128dec[cp1251num] = i;
                if (encodeMode === 1) {
                    charEnc = String.fromCharCode(cp1251num);
                }
            }
            vc128.vc128enc[i] = charEnc;
        };

        vc128.currentEncodeMode = encodeMode;
    }

    /**
     * Encode text-string to base-128
     * use inside:
     *   vc128.currentEncodeMode (1 or 2 or 3, @see vc128.init )
     *   vc128.splitWidth (to split result to lines by width, set 0 if no need)
     *   vc128.addPf (true or false, will add <~ ... ~> or not)
     * @param data binary string
     * @return vc128 encoded string
     */
    public static encode(data: string): string {
        const uint8Arr = new Uint8Array(new TextEncoder().encode(data));
        return vc128.encodeUint8Arr(uint8Arr);
    }

    /**
     * Encode bytes-array to base-128
     * @param data binary string
     * @return vc128 encoded string
     */
    public static encodeUint8Arr(inUint8Arr: Uint8Array): string {

        vc128.currentEncodeMode || vc128.init();
        const len: number = inUint8Arr.length;
        const sub: number = len % 7;
        const pad: number = sub ? (7 - sub) : 0;

        const paddedUint8Arr = new Uint8Array(len + pad + 1);
        paddedUint8Arr.set(inUint8Arr, 1);

        const dataView = new DataView(paddedUint8Arr.buffer);
        const out: string[] = vc128.addPf ? ['`{'] : [];
        const pow128Arr: bigint[] = [562949953421312n, 4398046511104n, 34359738368n, 268435456n, 2097152n, 16384n, 128n, 1n];
        const enc128Arr: string[] = vc128.vc128enc;
        for (let i = 0; i < len; i+= 7) {
            // idea: let uint64 = dataView.getUint64(i, false);
            const uint64High = dataView.getUint32(i, false) & 0xFFFFFF;
            const uint64Low = dataView.getUint32(i + 4, false);
            let uint64 =(BigInt(uint64High) << BigInt(32)) + BigInt(uint64Low);
            let sum: string = '';
            pow128Arr.forEach(pow => {
                const rem: bigint  = uint64 % pow;
                sum += enc128Arr[Number(uint64 / pow)];
                uint64 = rem;
            });
            out.push(sum);
        };

        if (pad) {
            const lg = out.length - 1;
            out[lg] = out[lg].substring (0, 8 - pad);
        }

        if (vc128.addPf) {
            out.push('}');
        }
        return (vc128.splitWidth > 0) ? vc128.implodeSplitter(out) : out.join('');
    }

    private static implodeSplitter(out: string[]): string {
        const arr: string[] = out.join('').match(new RegExp(`.{1,${vc128.splitWidth}}`, 'g')) || [];
        return arr.join('\n');
    }

    /**
     * Decode base128 string to bytes array
     *
     * @param dataSrc base-128 encoded string
     * @return decoded bytes array
     */
    public static decodeToUint8Arr(dataSrc: string): Uint8Array {
        vc128.currentEncodeMode || vc128.init();

        // cut data between <~ ... ~>
        let i: number = dataSrc.indexOf('`{');
        i = (i < 0) ? 0 : i + 2;

        const j: number = dataSrc.indexOf('}', i);
        let dataPre = (j > 0) ? dataSrc.substring(i, j) : dataSrc.substring(i);

        dataPre = dataPre.replace(/\s/g, '');


        const len: number = dataPre.length;

        const sub: number = len % 8;
        const pad: number = sub ? (8 - sub) : 0;

        const data = dataPre + vc128.vc128enc[127].repeat(pad);

        const out: number[] = [];

        data.match(/.{1,8}/g)!.forEach(value => {
            let sum: bigint = 0n;
            value.split('').forEach(char => {
                const chcode = char.charCodeAt(0);
                sum = (sum << 7n) + BigInt(vc128.vc128dec[chcode] !== undefined ? vc128.vc128dec[chcode] : 0);
            });

            for (let i = 6; i >= 0; i--) {
                out.push(Number((sum >> BigInt(i * 8)) & 0xFFn));
                //out.push((sum >> (i * 8)) & 0xFF);
            }
        });

        return sub ? new Uint8Array(out.slice(0, -pad)) : new Uint8Array(out);
    }

    /**
     * Decode base128 decoding to string
     *
     * @param dataSrc base-128 encoded string
     * @return decoded string
     */
    public static decode(data: string): string {
        let Uint8Arr = vc128.decodeToUint8Arr(data);
        const textDecoder = new TextDecoder('utf-8');
        return textDecoder.decode(Uint8Arr);
    }
}