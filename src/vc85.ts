/// <reference path="./custom.d.ts" />

export default class vc85 {
    public static vc85enc: string[] = []; // [number] => string (utf)
    public static vc85dec: Record<number, number> = {}; // [number] => number

    // encoder options:
    public static currentEncodeMode: number = 0;
    public static defaultEncodeMode: number = 2; // @see init
    public static splitWidth: number = 75; // split result to lines by width
    public static addPf: boolean = true; // add <~ ... ~> or not

    public static lastDecodedIsAlt85 = false;

    /**
     * (Optional)
     * The constructor is used only to set parameters.
     * if null is passed then the default-value is used
     * for example, call "new vc85(3);" will set encodeMode = 3
     *
     * @param encodeMode null or 1,2,3 (default = 2)
     * @param splitWidth null or split width (default = 75)
     * @param addPf null or true or false (default = true)
     */
    public constructor(encodeMode: number | null = null, splitWidth: number | null = null, addPf: boolean | null = null) {
        if (typeof encodeMode === 'number') {
            vc85.init(encodeMode);
        }
        if (typeof splitWidth === 'number') {
            vc85.splitWidth = Math.floor(splitWidth);
        }
        if (addPf !== null) {
            vc85.addPf = !!addPf;
        }
    }

    /**
     * encodeMode:
     *  0 - get actual value from vc85.defaultEncodeMode
     *  1 - classic ascii85 compatible characters table
     *  2 - vwx (default) - ascii85 with replaces: "=>v '=>w \=>x
     *  3 - vc85 - ascii85 with replaces all spec.chars to visually distinct characters (utf-8)
     *  4 - vc85 - same as 3, but the result will be encoded in windows-cp1251
     * @param encodeMode Mode 1, default = 2, 3
     */
    public static init(encodeMode: number = 0): void {
        if (!encodeMode) {
            encodeMode = vc85.defaultEncodeMode;
        }
        if (vc85.currentEncodeMode === encodeMode) {
            return;
        }

        let repc: number = 118; // replaces: "=>v '=>w \=>x
        for (let i = 0; i < 85; i++) {
            let cn: number = 33 + i;
            vc85.vc85dec[cn] = i;
            if (cn === 34 || cn === 39 || cn === 92) {
                const ca: number = repc++;
                vc85.vc85dec[ca] = i;
                if (encodeMode > 1) {
                    cn = ca;
                }
            }
            vc85.vc85enc[i] = String.fromCharCode(cn);
        }

        // replacement table: first char = from, second char = to.
        const repArr: string[] = ['!Я', '#Ж', '$Д', '%П', '&Ц', '(Щ', ')щ', '*ж', '+ф', ',ц', '-Э', '.я',
            '/ю', ':д', ';Б', '<Г', '=э', '>ъ', '?Ъ', '@Ф', 'IИ', 'OЮ', '[Ш', ']ш', '^л', '`й', 'lЛ'];
        // add windows-cp1251 char table
        const cp1251 = [223,198,196,207,214,217,249,230,244,246,221,255,254,228,193,195,253,250,218,212,200,222,216,248,235,233,203];

        repArr.forEach((repCh, n) => {
            const cn: number = repCh.charCodeAt(0);
            const ca: number = repCh.charCodeAt(repCh.length - 1);
            const cp = cp1251[n];
            const i: number = cn - 33;
            if (encodeMode > 2) {
                vc85.vc85enc[i] = (encodeMode === 4) ? String.fromCharCode(cp) : repCh.substring(1);
            }
            vc85.vc85dec[ca] = i;
            vc85.vc85dec[cp] = i;
            if (ca > 1088) {    //d1 xx
                vc85.vc85dec[ca - 960] = i;
            } else if (ca > 1024) { //d0 xx
                vc85.vc85dec[ca - 896] = i;
            }
        });

        vc85.currentEncodeMode = encodeMode;
    }

    /**
     * Encode text-string to base-85
     * use inside:
     *   vc85.currentEncodeMode (1 or 2 or 3, @see vc85.init )
     *   vc85.splitWidth (to split result to lines by width, set 0 if no need)
     *   vc85.addPf (true or false, will add <~ ... ~> or not)
     * @param data binary string
     * @return vc85 encoded string
     */
    public static encode(data: string): string {
        const uint8Arr = new Uint8Array(new TextEncoder().encode(data));
        return vc85.encodeUint8Arr(uint8Arr);
    }

    /**
     * Encode bytes-array to base-85
     * @param data binary string
     * @return vc85 encoded string
     */
    public static encodeUint8Arr(inUint8Arr: Uint8Array, altPf: boolean = false): string {

        vc85.currentEncodeMode || vc85.init();
        const len: number = inUint8Arr.length;
        const sub: number = len % 4;
        const pad: number = sub ? (4 - sub) : 0;

        const paddedUint8Arr = pad ? new Uint8Array(len + pad) : inUint8Arr;
        if (pad) {
            paddedUint8Arr.set(inUint8Arr);
        }
        const dataView = new DataView(paddedUint8Arr.buffer);
        const out: string[] = vc85.addPf ? [altPf ? '{~' : '<~'] : [];
        const pow85Arr: number[] = [52200625, 614125, 7225, 85, 1];
        const enc85Arr: string[] = vc85.vc85enc;
        for (let i = 0; i < len; i+= 4) {
            let uint32 = dataView.getUint32(i, false);
            let sum: string = '';
            pow85Arr.forEach(pow => {
                const rem: number = uint32 % pow;
                sum += enc85Arr[Math.floor(uint32 / pow)];
                uint32 = rem;
            });
            out.push(sum);
        };

        if (pad) {
            const lg = out.length - 1;
            out[lg] = out[lg].substring (0, 5 - pad);
        }

        if (vc85.addPf) {
            out.push(altPf ? '~}' : '~>');
        }

        return (vc85.splitWidth > 0) ? vc85.implodeSplitter(out) : out.join('');
    }

    private static implodeSplitter(out: string[]): string {
        const arr: string[] = out.join('').match(new RegExp(`.{1,${vc85.splitWidth}}`, 'g')) || [];
        const lc = arr[arr.length-1];
        if (lc === '>' || lc === '}') {
            arr[arr.length-2] += lc;
            arr[arr.length-1] = '';
        }
        const fc = arr[0];
        if (fc === '<' || fc === '{') {
            arr[0] = fc + arr[1];
            arr[1] = '';
        }
        return arr.join('\n');
    }

    /**
     * Decode base85 string to bytes array
     *
     * @param dataSrc base-85 encoded string
     * @return decoded bytes array
     */
    public static decodeToUint8Arr(dataSrc: string): Uint8Array {
        vc85.currentEncodeMode || vc85.init();

        // cut data between <~ ... ~>
        let i: number = dataSrc.indexOf('~');
        i = (i < 0) ? 0 : i + 1;
            
        vc85.lastDecodedIsAlt85 = (i > 1) && (dataSrc.charAt(i-2) === '{');

        const j: number = dataSrc.indexOf('~', i);
        let dataPre = (j > 0) ? dataSrc.substring(i, j) : dataSrc.substring(i);

        dataPre = dataPre.replace(/\s/g, '').replace(/z/g, '!!!!!').replace(/y/g, '+<VdL');


        const len: number = dataPre.length;

        const sub: number = len % 5;
        const pad: number = sub ? (5 - sub) : 0;

        const data = dataPre + vc85.vc85enc[84].repeat(pad);

        const out: number[] = [];

        data.match(/.{1,5}/g)!.forEach(value => {
            let sum: number = 0;
            value.split('').forEach(char => {
                const chcode = char.charCodeAt(0);
                sum = sum * 85 + (vc85.vc85dec[chcode] !== undefined ? vc85.vc85dec[chcode] : 0);
            });

            for (let i = 3; i >= 0; i--) {
                out.push((sum >> (i * 8)) & 0xFF);
            }
        });

        return sub ? new Uint8Array(out.slice(0, -pad)) : new Uint8Array(out);
    }

    /**
     * Decode base85 decoding to string
     *
     * @param dataSrc base-85 encoded string
     * @return decoded string
     */
    public static decode(data: string): string {
        let Uint8Arr = vc85.decodeToUint8Arr(data);
        const textDecoder = new TextDecoder('utf-8');
        return textDecoder.decode(Uint8Arr);
    }

    public static convert(data: string, toMode: number = 0): string {
        if (!toMode) {
            toMode = vc85.currentEncodeMode;
        }
        vc85.init(toMode);

        // need data between <~ ... ~>
        let fromPos: number = data.indexOf('<~');
        if (fromPos < 0) {
            fromPos = data.indexOf('{~');
        }
        fromPos = (fromPos < 0) ? 0 : fromPos + 2;
        
        let toPos: number = data.length;
        let j: number = data.indexOf('~>', fromPos);
        if (j < 0) {
            j = data.indexOf('~}', fromPos);
        }
        if (j >= 0) {
            toPos = j;
        }

        for(let p=fromPos; p < toPos; p++) {
            const chcode = data.charCodeAt(p);
            if (vc85.vc85dec[chcode] !== undefined) {
                const num85 = vc85.vc85dec[chcode];
                const chnew = vc85.vc85enc[num85];
                if (data[p] !== chnew) {
                    data = data.substring(0, p) + chnew + data.substring(p + 1);
                }
            }
        };

        return data;
    }
}