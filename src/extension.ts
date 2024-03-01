/// <reference path="./custom.d.ts" />

import type {} from './custom.d.ts';

import * as vscode from 'vscode';
import dubla from './dubla';
import base16 from './base16';
import base64alt from './base64alt';
import altbase64 from './altbase64';
import alt85 from './alt85';
import extConfig from './extconfig';
import menucontext from './menucontext';
import alt128vc from './alt128vc';
import vc85 from './vc85';

// Create selection-converter function envelope for specified converter_fn
function cre_sel_conv_fn(converter_fn: (text: string) => string | null, targetLang: string = '') {
    return async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        
        // Multi-selections support
        const { document, selections } = editor;
        const selectedTexts: string[] = [];

        for (const selection of selections) {
            const sel_text = document.getText(selection);
            const len = sel_text.length;
            if (len) {
                selectedTexts.push(sel_text);
            }
        }
        let combinedText = selectedTexts.join("\n");
        
        const emptySelection = combinedText.length < 1;
        //const docIsSaved = !document.isDirty;

        if (emptySelection) {
            if (!targetLang) {
                vscode.window.showWarningMessage('No text selected!');
                return;
            }
            combinedText = document.getText();
        }

        const convertedText = converter_fn(combinedText);

        if (convertedText) {
            if (targetLang) {
                const newFile = await vscode.workspace.openTextDocument({
                    content: convertedText,
                    language: targetLang,
                });
                vscode.window.showTextDocument(newFile);
            } else {
                editor.edit(editBuilder => {
                    editBuilder.replace(editor.selection, convertedText);
                }).then(() => {
                    // call a reaction to a change in the selection
                    menucontext.onSelectionChangeByEditor(editor);
                });
            }
        }
    };
}

export function activate(context: vscode.ExtensionContext) {
    extConfig.initConfig();
    //Commands registration
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.encode', cre_sel_conv_fn(SELECTIONtoDubla))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.decode', cre_sel_conv_fn(SELECTIONfromDubla))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.toBase64', cre_sel_conv_fn(SELECTIONtoBase64))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.fromBase64', cre_sel_conv_fn(SELECTIONfromBase64))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.toHex', cre_sel_conv_fn(SELECTIONtoHEX))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.fromHex', cre_sel_conv_fn(SELECTIONfromHEX))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.toAlt85', cre_sel_conv_fn(SELECTIONtoAlt85))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.fromAlt85', cre_sel_conv_fn(SELECTIONfromAlt85))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.fromBase85', cre_sel_conv_fn(SELECTIONfromBase85))
    );


    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.toAlt128', cre_sel_conv_fn(SELECTIONtoAlt128))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.fromAlt128', cre_sel_conv_fn(SELECTIONfromAlt128))
    );

    // context.subscriptions.push(
    //     vscode.commands.registerCommand('dubla.hexToBase64', cre_sel_conv_fn(SELECTIONhexToBase64))
    // );
    // context.subscriptions.push(
    //     vscode.commands.registerCommand('dubla.base64ToHex', cre_sel_conv_fn(SELECTIONBase64toHex))
    // );

    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.toAltBase64', cre_sel_conv_fn(SELECTIONtoAltBase64))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dubla.fromAltBase64', cre_sel_conv_fn(SELECTIONfromAltBase64))
    );

    vscode.window.onDidChangeTextEditorSelection(menucontext.onSelectionChange);

//    vscode.languages.registerHoverProvider('dubla', hoverlook.hoverProvider);
}

export function deactivate() { }

export function SELECTIONtoBase85(sel_text: string): string | null {
    try {
        return alt85.encode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to Alt85: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoAlt85(sel_text: string): string | null {
    try {
        return alt85.encode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to Alt85: ${e.message}`);
    }
    return null;
}

export function SELECTIONfromAlt85(sel_text: string): string | null {
    try {
        return alt85.decode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from Alt85: ${e.message}`);
    }
    return null;
}
export function SELECTIONfromBase85(sel_text: string): string | null {
    try {
        return vc85.decode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from Base85: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoAlt128(sel_text: string): string | null {
    try {
        return alt128vc.encode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to Alt128: ${e.message}`);
    }
    return null;
}

export function SELECTIONfromAlt128(sel_text: string): string | null {
    try {
        return alt128vc.decode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from Alt128: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoHEX(sel_text: string): string | null {
    try {
        return base16.encode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to HEX: ${e.message}`);
    }
    return null;
}

export function SELECTIONfromHEX(sel_text: string): string | null {
    try {
        return base16.decode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from HEX: ${e.message}`);
    }
    return null;
}

// export function SELECTIONhexToBase64(sel_text: string): string | null {
//     try {
//         return base1664.hexToBase64(sel_text, extConfig.confUrlModeBase64);
//     } catch(e: any) {
//         vscode.window.showErrorMessage(`Failed convert hex to base64: ${e.message}`);
//     }
//     return null;
// }

// export function SELECTIONBase64toHex(sel_text: string): string | null {
//     try {
//         return base1664.base64ToHex(sel_text);
//     } catch(e: any) {
//         vscode.window.showErrorMessage(`Failed convert base64 to hex: ${e.message}`);
//     }
//     return null;
// }

export function SELECTIONtoDubla(sel_text: string) : string | null {
    try {
        return dubla.encode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to Dubla: ${e.message}`);
    }
    return null;
}
export function SELECTIONfromDubla(sel_text: string) : string | null {
    try {
        return dubla.decode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from Dubla: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoAltBase64(sel_text: string) : string | null {
    try {
        return altbase64.encode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to AltBase64: ${e.message}`);
    }
    return null;
}
export function SELECTIONfromAltBase64(sel_text: string) : string | null {
    try {
        return altbase64.decode(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from AltBase64: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoBase64(sel_text: string) : string | null {
    try {
        return base64alt.encodeRaw(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to AltBase64: ${e.message}`);
    }
    return null;
}
export function SELECTIONfromBase64(sel_text: string) : string | null {
    try {
        return base64alt.decodeRaw(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from AltBase64: ${e.message}`);
    }
    return null;
}