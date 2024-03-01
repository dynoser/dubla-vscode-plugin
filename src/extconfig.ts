import * as vscode from 'vscode';
import dubla from './dubla';
import dublaRaw from './dublaRaw';
import menuContext from './menucontext';
import base64alt from './base64alt';
import AltBase64 from './altbase64';
import vc85 from './vc85';

export default class extConfig {
    static extname = 'dubla';

    static confUrlModeBase64 = true; // urlModeBase64

    static reloadConfig(event: vscode.ConfigurationChangeEvent | null = null) {
        const config = vscode.workspace.getConfiguration(extConfig.extname);

        const splitWidth = config.get<number>('splitWidth');
        const canUseDeflate = config.get<boolean>('canUseDeflate');
        const addPf = config.get<boolean>('addPrefixes');
        const menuEncodeEnabled = config.get<boolean>('menuEncodeEnabled');
        const menuEncodeAlt64Enabled = config.get<boolean>('menuEncodeAlt64Enabled');
        const menuEncodeBase64Enabled = config.get<boolean>('menuEncodeBase64Enabled');
        const menuEncodeAlt85Enabled = config.get<boolean>('menuEncodeAlt85Enabled');
        const menuEncodeAlt128Enabled = config.get<boolean>('menuEncodeAlt128Enabled');
        const confBase64UrlMode = config.get<boolean>('urlModeBase64');

        if (splitWidth !== undefined) {
            dublaRaw.splitWidth = splitWidth;
            base64alt.splitWidth = splitWidth;
        }

        if (canUseDeflate !== undefined) {
            dubla.gzEnabled = canUseDeflate;
            AltBase64.gzEnabled = canUseDeflate;
        }

        if (addPf !== undefined && addPf !== dublaRaw.addPf) {
            dublaRaw.addPf = addPf;
        }

        if (menuEncodeEnabled !== undefined && menuEncodeEnabled !== menuContext.menuEncodeEnabled) {
            menuContext.menuEncodeEnabled = menuEncodeEnabled;
        }
        
        if (menuEncodeAlt64Enabled !== undefined && menuEncodeAlt64Enabled !== menuContext.menuEncodeAlt64Enabled) {
            menuContext.menuEncodeAlt64Enabled = menuEncodeAlt64Enabled;
        }

        if (menuEncodeBase64Enabled !== undefined && menuEncodeBase64Enabled !== menuContext.menuEncodeBase64Enabled) {
            menuContext.menuEncodeBase64Enabled = menuEncodeBase64Enabled;
        }

        if (menuEncodeAlt85Enabled !== undefined && menuEncodeAlt85Enabled !== menuContext.menuEncodeAlt85Enabled) {
            menuContext.menuEncodeAlt85Enabled = menuEncodeAlt85Enabled;
        }

        if (menuEncodeAlt128Enabled !== undefined && menuEncodeAlt128Enabled !== menuContext.menuEncode128Enabled) {
            menuContext.menuEncode128Enabled = menuEncodeAlt128Enabled;
        }

        if (confBase64UrlMode !== undefined) {
            extConfig.confUrlModeBase64 = confBase64UrlMode;
            base64alt.urlMode = confBase64UrlMode;
        }

        vc85.defaultEncodeMode = 3;
    }

    static initConfig(): void {
        extConfig.reloadConfig();
        // Auto-update config on changes
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(extConfig.extname)) {
                extConfig.reloadConfig(event);
            }
        });
    }
}
