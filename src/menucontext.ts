import * as vscode from 'vscode';

export default class menuContext {
    public static menuEncodeEnabled: boolean = true;
    public static menuEncodeAlt64Enabled: boolean = true;
    public static menuEncodeBase64Enabled: boolean = false;
    public static menuEncodeAlt85Enabled: boolean = false;
    public static menuEncode128Enabled: boolean = false;

    public static docIsDubla: boolean = false;

    public static menuCanDecode: boolean = false;
    public static menuCanEncode: boolean = false;
    public static menuCanAlt64Encode: boolean = false;
    public static menuCanBase64Encode: boolean = false;
    public static menuCanAlt85Encode: boolean = false;
    public static menuCanAlt128Encode: boolean = false;

    public static menuSelExactlyDbl: boolean = false;
    public static menuSelExactlyBase85: boolean = false;
    public static menuSelExactlyAlt85: boolean = false;
    public static menuSelExactly128: boolean = false;
    public static menuSelExactlyA64: boolean = false;
    public static menuSelMaybeB64: boolean = false;
    public static menuSelMaybeHex: boolean = false;

    public static onSelectionChange(event: vscode.TextEditorSelectionChangeEvent)
    {
        return menuContext.onSelectionChangeByEditor(event.textEditor);
    }

    public static onSelectionChangeByEditor(textEditor: vscode.TextEditor) {
    const { document, selection } = textEditor;

    const langID = document.languageId;

        menuContext.docIsDubla = langID === '.dbl';
        let canMenuDecode = menuContext.docIsDubla;
        let canMenuEncode = false;
        let canMenuAlt64Encode = false;
        let canMenuBase64Encode = false;
        let canMenuAlt85Encode = false;
        let canMenuAlt128Encode = false;
        let selExactlyDbl = false;
        let selMayBeDbl = false;
        let selExactlyAlt85 = false;
        let selExactlyBase85 = false;
        let selMaybeHex = false;
        let selExactly128 = false;
        let selExactlyA64 = false;
        let selMaybeB64 = false
        let selExactly = false;

        // try to detect known prefixes
        const sel_text = document.getText(selection);
        let strlen = sel_text.length;
        if (sel_text) {
            let firstCh = '';
            let lastCh = '';

            // reduce line border by end-spaces
            const spcs = " \t\n\r";
            while(strlen) {
                lastCh = sel_text[strlen-1];
                if (spcs.indexOf(lastCh) < 0) break;
                strlen--;
            }

            // reduce line border by start-spaces
            let i = 0;
            while (i < strlen) {
                firstCh = sel_text[i];
                if (spcs.indexOf(firstCh) < 0) break;
                i++;
                strlen--;
            }

            // Is the selected text enclosed in quotation?
            const inQuotas: string = ((lastCh === firstCh && strlen > 2) && ('`\'"'.indexOf(firstCh) >= 0)) ? lastCh : '';

            if (inQuotas) {
                i++;
                firstCh = sel_text.charAt(i);
                strlen -= 2;
                lastCh = sel_text.charAt(i + strlen - 1);
            }

            if (strlen > 1) {
                if (firstCh === '¨' && strlen>2 && lastCh === '·') {
                    selExactlyDbl = true;
                    selExactly = true;
                    canMenuDecode = true;
                }
                if (firstCh === '`' && strlen>2 && lastCh === '}' && sel_text.charAt(i+1) === '{') {
                    selExactly128 = true;
                    selExactly = true;
                }
                if (firstCh === '<' && strlen>2 && sel_text.charAt(i+1) === '~') {
                    selExactlyBase85 = true;
                    selExactly = true;
                }
                if (firstCh === '{' && strlen>2 && sel_text.charAt(i+1) === '~') {
                    selExactlyAlt85 = true;
                    selExactly = true;
                }
                if (!selExactly && firstCh === '=') {
                    selExactlyA64 = /^[A-Za-z0-9+\-_/=\s]*$/.test(sel_text.substring(i, i+strlen));
                    if (selExactlyA64) {
                        selExactly = true;
                    }
                }
                if (!selExactly) {
                    const chkLen = strlen > 100 ? 100 : strlen;

                    selMaybeB64 = /^[A-Za-z0-9+\-_/=\s]*$/.test(sel_text.substring(i, i+chkLen));

                    if (selMaybeB64) {
                        if (sel_text.substring(i, i+2) === '0x') {
                            i += 2;
                            strlen -= 2;
                            selMaybeB64 = false;
                        }
                        selMaybeHex = /^[0-9a-fA-F\s]*$/.test(sel_text.substring(i, i + strlen));
                        let eol = sel_text.indexOf("\n", i);
                        if (eol < 0) {
                            eol = i + chkLen - 1;
                        }
                        if (eol > i && eol < i+chkLen) {
                            let lines = sel_text.substring(i, i+chkLen).split("\n");
                            for (let line of lines) {
                                if (/\s/.test(line.trim())) {
                                    selMaybeB64 = false;
                                    break;
                                }
                            }
                        }
                    } else {
                        selMayBeDbl = true;
                        for(let p = i; p < chkLen; p++) {
                            const uniCodeNum: number = sel_text.charCodeAt(p);
                            if (uniCodeNum === 32 || uniCodeNum === 10 || uniCodeNum === 13) continue;
                            if (uniCodeNum < 161 || uniCodeNum > 1415) {
                                selMayBeDbl = false;
                                break;
                            }
                        }
                        if (selMayBeDbl) {
                            canMenuDecode = true;
                        }
                    }
                }

                if (!selExactly) {
                    canMenuEncode = true;
                }
            }
        }
    

        if (canMenuDecode !== menuContext.menuCanDecode) {
            menuContext.menuCanDecode = canMenuDecode;
            vscode.commands.executeCommand("setContext", "dubla.canDecode", menuContext.menuCanDecode).then(() => {
                return menuContext.menuCanDecode;
            });
        }

        canMenuAlt64Encode = canMenuEncode;
        canMenuBase64Encode = canMenuEncode;
        canMenuAlt85Encode = canMenuEncode;
        canMenuAlt128Encode = canMenuEncode;
        if (!menuContext.menuEncodeEnabled) {
            canMenuEncode = false;
        }
        if (!menuContext.menuEncodeAlt64Enabled || selMaybeB64) {
            canMenuAlt64Encode = false;
        }
        if (!menuContext.menuEncodeBase64Enabled || selMaybeB64) {
            canMenuBase64Encode = false;
        }
        if (!menuContext.menuEncodeAlt85Enabled || selMaybeB64) {
            canMenuAlt85Encode = false;
        }
        if (!menuContext.menuEncode128Enabled || selMaybeB64) {
            canMenuAlt128Encode = false;
        }

        if (selMaybeHex && strlen > 15) {
            // already encoded to hex
            selMaybeB64 = false;
            canMenuBase64Encode = false;
            canMenuAlt64Encode = false;
            canMenuAlt85Encode = false;
            canMenuAlt128Encode = false;
        }


        if (canMenuEncode !== menuContext.menuCanEncode) {
            menuContext.menuCanEncode = canMenuEncode;
            vscode.commands.executeCommand("setContext", "dubla.canEncode", menuContext.menuCanEncode).then(() => {
                return menuContext.menuCanEncode;
            });
        }
        if (canMenuAlt64Encode !== menuContext.menuCanAlt64Encode) {
            menuContext.menuCanAlt64Encode = canMenuAlt64Encode;
            vscode.commands.executeCommand("setContext", "dubla.canEncodeAlt64", menuContext.menuCanAlt64Encode).then(() => {
                return menuContext.menuCanAlt64Encode;
            });
        }
        if (canMenuBase64Encode !== menuContext.menuCanBase64Encode) {
            menuContext.menuCanBase64Encode = canMenuBase64Encode;
            vscode.commands.executeCommand("setContext", "dubla.canEncodeBase64", menuContext.menuCanBase64Encode).then(() => {
                return menuContext.menuCanBase64Encode;
            });
        }
        if (canMenuAlt85Encode !== menuContext.menuCanAlt85Encode) {
            menuContext.menuCanAlt85Encode = canMenuAlt85Encode;
            vscode.commands.executeCommand("setContext", "dubla.canEncodeAlt85", menuContext.menuCanAlt85Encode).then(() => {
                return menuContext.menuCanAlt85Encode;
            });
        }
        if (canMenuAlt128Encode !== menuContext.menuCanAlt128Encode) {
            menuContext.menuCanAlt128Encode = canMenuAlt128Encode;
            vscode.commands.executeCommand("setContext", "dubla.canEncode128", menuContext.menuCanAlt128Encode).then(() => {
                return menuContext.menuCanAlt128Encode;
            });
        }

        if (selExactlyDbl !== menuContext.menuSelExactlyDbl) {
            menuContext.menuSelExactlyDbl = selExactlyDbl;
            vscode.commands.executeCommand("setContext", "dubla.selExactlyDbl", menuContext.menuSelExactlyDbl).then(() => {
                return menuContext.menuSelExactlyDbl;
            });
        }

        if (selExactlyAlt85 !== menuContext.menuSelExactlyAlt85) {
            menuContext.menuSelExactlyAlt85 = selExactlyAlt85;
            vscode.commands.executeCommand("setContext", "dubla.selExactlyAlt85", menuContext.menuSelExactlyAlt85).then(() => {
                return menuContext.menuSelExactlyAlt85;
            });
        }

        if (selExactlyBase85 !== menuContext.menuSelExactlyBase85) {
            menuContext.menuSelExactlyBase85 = selExactlyBase85;
            vscode.commands.executeCommand("setContext", "dubla.selExactlyBase85", menuContext.menuSelExactlyBase85).then(() => {
                return menuContext.menuSelExactlyBase85;
            });
        }

        if (selExactly128 !== menuContext.menuSelExactly128) {
            menuContext.menuSelExactly128 = selExactly128;
            vscode.commands.executeCommand("setContext", "dubla.selExactly128", menuContext.menuSelExactly128).then(() => {
                return menuContext.menuSelExactly128;
            });
        }

        if (selMaybeHex !== menuContext.menuSelMaybeHex) {
            menuContext.menuSelMaybeHex = selMaybeHex;
            vscode.commands.executeCommand("setContext", "dubla.selMaybeHex", menuContext.menuSelMaybeHex).then(() => {
                return menuContext.menuSelMaybeHex;
            });
        }

        // if (selMaybeHex !== menuContext.menuSelMaybeHex) {
        //     menuContext.menuSelMaybeHex = selMaybeHex;
        //     vscode.commands.executeCommand("setContext", "dubla.selMaybeHex", menuContext.menuSelMaybeHex).then(() => {
        //         return menuContext.menuSelMaybeHex;
        //     });
        // }

        if (selMaybeB64 !== menuContext.menuSelMaybeB64) {
            menuContext.menuSelMaybeB64 = selMaybeB64;
            vscode.commands.executeCommand("setContext", "dubla.selMaybeB64", menuContext.menuSelMaybeB64).then(() => {
                return menuContext.menuSelMaybeB64;
            });
        }

        if (selExactlyA64 !== menuContext.menuSelExactlyA64) {
            menuContext.menuSelExactlyA64 = selExactlyA64;
            vscode.commands.executeCommand("setContext", "dubla.selExactlyA64", menuContext.menuSelExactlyA64).then(() => {
                return menuContext.menuSelExactlyA64;
            });
        }
    }
}