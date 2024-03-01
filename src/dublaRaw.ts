export default class dublaRaw {
    public static charSet: string =
      'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
    + 'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿ'
    + 'ŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ'
    + 'ƀ¡¢£¤¥¦§©ƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿ'
    + 'ǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿ'
    + 'ȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶ®ȸȹȺȻȼȽȾȿ'
    + 'ɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿ'
    + 'ʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿ'
    + '°±²³΄΅Ά·ΈΉΊ´ΌµΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ¶ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξο'
    + 'πρςστυφχψωϊϋόύώϏϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϰϱϲϳϴϵ϶ϷϸϹϺϻϼ¬ϾϿ'
    + 'ЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп'
    + 'рстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿ'
    + 'Ҁҁ҂¹º¼½¾¿րҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿ'
    + 'ӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿ'
    + 'ԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯցԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿ'
    + 'ՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖւփՙ՚ք՜ֆ՞օևաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտ'
    ; // charset = 1024 chars

    public static to1024: { [key: number]: number } = {}; // [unicode-char-num] => [num1024]
    public static num1024toChar: { [key: number]: string } = {}; // [num1024]   => unicode-char

    public static splitWidth: number = 80; // split result to lines by width

    public static inited: boolean = false;

    public static addPf: boolean = true;

    public static init(): void {
        dublaRaw.inited = true;
        dublaRaw.charSet.split('').forEach((unicodeChar, num1024) => {
            dublaRaw.to1024[unicodeChar.charCodeAt(0)] = num1024;
            dublaRaw.num1024toChar[num1024] = unicodeChar;
        });
    }

    public static encodeBytes(uint8Arr: Uint8Array): string {

        dublaRaw.inited || dublaRaw.init();

        const data = new DataView(uint8Arr.buffer);
        const l: number = uint8Arr.length;
        const out: string[] = dublaRaw.addPf ? ['¨'] : [];

        let a: number = 0;
        let b: number = 0;
        let c: number = 0;
        let d: number = 0;

        let p: number = 0;

        for ( ; p < l; ) {
            let byte0: number = data.getUint8(p++);
            a = byte0 << 2;

            if (p < l) {
                let byte1: number = data.getUint8(p++);
                a += (byte1 & 0xC0) >> 6;
                b = (byte1 & 0x3F) << 4;

                if (p < l) {
                    let byte2: number = data.getUint8(p++);
                    b += (byte2 & 0xF0) >> 4;
                    c = (byte2 & 0x0F) << 6;

                    if (p < l) {
                        let byte3: number = data.getUint8(p++);
                        c += (byte3 & 0xFC) >> 2;
                        d = (byte3 & 0x03) << 8;

                        if (p < l) {
                            let byte4: number = data.getUint8(p++);
                            d += byte4;
                        } else {
                            out.push(dublaRaw.num1024toChar[a]);
                            out.push(dublaRaw.num1024toChar[b]);
                            out.push(dublaRaw.num1024toChar[c]);
                            out.push(dublaRaw.num1024toChar[d]);
                            break;
                        }
                    } else {
                        out.push(dublaRaw.num1024toChar[a]);
                        out.push(dublaRaw.num1024toChar[b]);
                        out.push(dublaRaw.num1024toChar[c]);
                        break;
                    }
                } else {
                    out.push(dublaRaw.num1024toChar[a]);
                    out.push(dublaRaw.num1024toChar[b]);
                    break;
                }
            } else {
                out.push(dublaRaw.num1024toChar[a]);
                break;
            }

            out.push(dublaRaw.num1024toChar[a]);
            out.push(dublaRaw.num1024toChar[b]);
            out.push(dublaRaw.num1024toChar[c]);
            out.push(dublaRaw.num1024toChar[d]);
        }

        if (l && !(l % 5) && !p) {
            out.push('=');
        }

        if (dublaRaw.addPf) {
            out.push('·');
        }

        return (dublaRaw.splitWidth > 0) ? dublaRaw.implodeSplitter(out) : out.join('');
    }

    private static implodeSplitter(out: string[]): string {
        const arr: string[] = out.join('').match(new RegExp(`.{1,${dublaRaw.splitWidth}}`, 'g')) || [];
        return arr.join("\n");
    }

    public static decodeBytes(dataSrc: string): Uint8Array {

        dublaRaw.inited || dublaRaw.init();

        // cut data between ¨ ... ·
        let i: number = dataSrc.indexOf('¨');
        i = (i < 0) ? 0 : i + 1;

        const j: number = dataSrc.indexOf('·', i);
        let data = (j > 0) ? dataSrc.substring(i, j) : dataSrc.substring(i);
       

        const out: number[] = [];
        const bytesLen: number = data.length;
        const dataArr: number[] = [];

        for (let p: number = 0; p < bytesLen; p++) {
            let uniCodeNum: number = data.charCodeAt(p);
            if (uniCodeNum > 160 && uniCodeNum < 1416) {
                if (dublaRaw.to1024[uniCodeNum] !== undefined) {
                    dataArr.push(dublaRaw.to1024[uniCodeNum]);
                } else {
                    dataArr.push(dublaRaw.convertBadCharTo1024(uniCodeNum));
                }
            }
        }

        const l: number = dataArr.length;

        if (l) {
            const sub: number = l % 4;
            const pad: number = sub ? (5 - sub) : 0;
            let doNotDropLastZero: boolean = false;

            if (pad) {
                dataArr.push(0);

                if (pad > 1) {
                    dataArr.push(0);

                    if (pad > 2) {
                        dataArr.push(0);
                    }
                }
            } else {
                doNotDropLastZero = data.trimEnd().endsWith('=');
            }

            for (let p: number = 0; p < l; ) {
                let a: number = dataArr[p++];
                let b: number = dataArr[p++];
                let c: number = dataArr[p++];
                let d: number = dataArr[p++];

                out.push((a >> 2) & 0xFF);
                out.push(((a & 0x03) << 6) | ((b >> 4) & 0x3F));
                out.push(((b & 0x0F) << 4) | ((c >> 6) & 0x0F));
                out.push(((c & 0x3F) << 2) | ((d >> 8) & 0x03));
                out.push(d & 0xFF);
            }

            if (pad) {
                out.splice(-pad);
            } else if (!doNotDropLastZero && out[out.length - 1] === 0) {
                out.pop();
            }
        }

        return new Uint8Array(out);
    }

    public static convertBadCharTo1024(ch: number ): number {
        // What happens if an invalid character is encountered?
        return 0;
    }
}
