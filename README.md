# Dubla

Encode and Decode. These menu items open by right-clicking on the selection:

![Menu Encode / Decode](https://raw.githubusercontent.com/dynoser/dubla-vscode-plugin/main/images/dubla-demo.gif)

`Ðubla` encoding scheme allows to almost halve the number of characters that the text takes up.

This is achieved through the use of two factors:
 1) Base-1024 charset;
 2) Compression use (AltBase64, Deflate).

### 1. Base-1024 charset.

This data encoding based on the following 1024 characters (10 bits encoded per each character space):

```text
ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ
ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿ
ŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ
ƀ¡¢£¤¥¦§©ƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿ
ǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿ
ȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶ®ȸȹȺȻȼȽȾȿ
ɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿ
ʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿ
°±²³΄΅Ά·ΈΉΊ´ΌµΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ¶ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξο
πρςστυφχψωϊϋόύώϏϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϰϱϲϳϴϵ϶ϷϸϹϺϻϼ¬ϾϿ
ЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп
рстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿ
Ҁҁ҂¹º¼½¾¿րҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿ
ӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿ
ԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯցԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿ
ՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖւփՙ՚ք՜ֆ՞օևաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտ
```
The character set used consists of 1024 different 2-byte UTF-8 characters.

### 2. Compression AltBase64, Deflate inside

AltBase64 encoding is additionally used within the Duble encoding.

Allows you to reduce the number of chars, especially effective for encoding Cyrillic text.

Optionally, the DEFLATE compression algorithm (RFC 1951) can be used.

## Prefix and postix

Dubla encoding uses an optional prefix `¨` and postfix `·` to indicate where the encoded data begins and ends.
If these delimiters are present, then only the characters between them are used during decoding.
These symbols are used only to facilitate visual and automatic recognition of the locations where Dubla encoded data resides

## Example
 - Text 273 chars:
```text
Man is distinguished, not only by his reason, but by this singular passion from
other animals, which is a lust of the mind, that by a  perseverance of delight in
the continued and indefatigable generation  of knowledge, exceeds the short vehemence
of any carnal pleasure
```

Dubla encoded (140 chars):
```text
¨ҔјոɱҌ°ҠӗӄÅϩȃƢΈûґϏýÍћƿŏȫҬʶǥփϐǝȎ՚ϩСϼɃȖƮЩȆջδՌգʢӔӮҨүФѼӥԿǣòȻϚõĺщӪҽсôӓΩѿΙÍʤȐβѰäՖɦøӕϤѳղԀāʦճҴϡ
ɮüυĕƻϐʯъĶϜƜɂʎĎ§ҩëωՙâǶьՔӖÁѿбևИբÙև¦ʽÅԊԫʣҷƉƯҊфɴĦω¼ȞɞԣՄʰ·
```

## Example Cyryllic
 - Cyrillic text 110 chars:
```text
И так во всём, как хотите, чтобы с вами поступали люди, так поступайте и вы с ними, ибо в этом закон и пророки
```
Dubla encoded (69 chars):
```text
¨ҸãԱǰëԕƯϔŠƉƸЀůϜԓńҒǾʴҸĜևѹȀ¢ƸӎäӠӀŲƸєòœԓÂѸӎäӠӀŔғԈեȳԂաҠ¿ϏΠĎեʹӓƣƹπţΟԈգǼԏƢΣƀ·
```

 - Cyrillic text 302 chars:
```text
Люди как реки: вода во всех одинакая и везде одна и та же, но каждая река бывает то узкая,
то быстрая, то широкая, то тихая. Так и люди. Каждый человек носит в себе зачатки всех
свойств людских и иногда проявляет одни, иногда другие и бывает часто совсем непохож на
себя, оставаясь одним и самим собою.
```
Dubla encoded (189 chars):
```text
¨ҨíǃŏΨÊգҐЈϟϔԃÏϔԾȐΑʾƠҠʀŠăԈեǑσďθ§ÏΣԓÏΘǤաһԊÁΌÐգҐЀևȱȀĄչƎզĤЀǉƽƎևȰœưĂǾǳѺՑѢàՎŠĂǾǳѹ©ȰĂƾҤҀоŏέǃňջŊÁµրէҐю
ȑëԇƠΡƾȟΈǁďϤßÄҨξȐΑʿåǸςǵʸєðΨΗբƸ·ƤǌþƓҹÕŴÑƾƠҜΤբÜԑðƸƏɄǠǾŏ΅ҕÁďԟÀόԾãϔńƏΜǍƥҸɾİƼńÔœԎäҁȀǀϯԎñҠҾŏΈÌŃƸŎÓϒƳÀ·
```

## Features

 - Encode/decode dubla to text in editor (selection menu items):
   - `dubla.encode` (menu item "Encode to dubla", convert selection text to dubla)
   - `dubla.decode` (menu item "Decode from dubla", convert selection from dubla)


You can find these menu items by right-clicking on the selection.
