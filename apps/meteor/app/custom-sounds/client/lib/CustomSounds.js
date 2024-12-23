"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSounds = void 0;
const reactive_var_1 = require("meteor/reactive-var");
const client_1 = require("../../../utils/client");
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
const getCustomSoundId = (soundId) => `custom-sound-${soundId}`;
const getAssetUrl = (asset, params) => (0, client_1.getURL)(asset, params, undefined, true);
const defaultSounds = [
    { _id: 'chime', name: 'Chime', extension: 'mp3', src: getAssetUrl('sounds/chime.mp3') },
    { _id: 'door', name: 'Door', extension: 'mp3', src: getAssetUrl('sounds/door.mp3') },
    { _id: 'beep', name: 'Beep', extension: 'mp3', src: getAssetUrl('sounds/beep.mp3') },
    { _id: 'chelle', name: 'Chelle', extension: 'mp3', src: getAssetUrl('sounds/chelle.mp3') },
    { _id: 'ding', name: 'Ding', extension: 'mp3', src: getAssetUrl('sounds/ding.mp3') },
    { _id: 'droplet', name: 'Droplet', extension: 'mp3', src: getAssetUrl('sounds/droplet.mp3') },
    { _id: 'highbell', name: 'Highbell', extension: 'mp3', src: getAssetUrl('sounds/highbell.mp3') },
    { _id: 'seasons', name: 'Seasons', extension: 'mp3', src: getAssetUrl('sounds/seasons.mp3') },
    { _id: 'telephone', name: 'Telephone', extension: 'mp3', src: getAssetUrl('sounds/telephone.mp3') },
    { _id: 'outbound-call-ringing', name: 'Outbound Call Ringing', extension: 'mp3', src: getAssetUrl('sounds/outbound-call-ringing.mp3') },
    { _id: 'call-ended', name: 'Call Ended', extension: 'mp3', src: getAssetUrl('sounds/call-ended.mp3') },
    { _id: 'dialtone', name: 'Dialtone', extension: 'mp3', src: getAssetUrl('sounds/dialtone.mp3') },
    { _id: 'ringtone', name: 'Ringtone', extension: 'mp3', src: getAssetUrl('sounds/ringtone.mp3') },
];
class CustomSoundsClass {
    constructor() {
        this.play = (soundId_1, ...args_1) => __awaiter(this, [soundId_1, ...args_1], void 0, function* (soundId, { volume = 1, loop = false } = {}) {
            const audio = document.querySelector(`#${getCustomSoundId(soundId)}`);
            if (!(audio === null || audio === void 0 ? void 0 : audio.play)) {
                return;
            }
            audio.volume = volume;
            audio.loop = loop;
            yield audio.play();
            return audio;
        });
        this.pause = (soundId) => {
            const audio = document.querySelector(`#${getCustomSoundId(soundId)}`);
            if (!(audio === null || audio === void 0 ? void 0 : audio.pause)) {
                return;
            }
            audio.pause();
        };
        this.stop = (soundId) => {
            const audio = document.querySelector(`#${getCustomSoundId(soundId)}`);
            if (!(audio === null || audio === void 0 ? void 0 : audio.load)) {
                return;
            }
            audio === null || audio === void 0 ? void 0 : audio.load();
        };
        this.isPlaying = (soundId) => {
            const audio = document.querySelector(`#${getCustomSoundId(soundId)}`);
            return audio && audio.duration > 0 && !audio.paused;
        };
        this.fetchCustomSoundList = () => __awaiter(this, void 0, void 0, function* () {
            if (this.initialFetchDone) {
                return;
            }
            const result = yield SDKClient_1.sdk.call('listCustomSounds');
            for (const sound of result) {
                this.add(sound);
            }
            this.initialFetchDone = true;
        });
        this.list = new reactive_var_1.ReactiveVar({});
        this.initialFetchDone = false;
        defaultSounds.forEach((sound) => this.add(sound));
    }
    add(sound) {
        if (!sound.src) {
            sound.src = this.getURL(sound);
        }
        const source = document.createElement('source');
        source.src = sound.src;
        const audio = document.createElement('audio');
        audio.id = getCustomSoundId(sound._id);
        audio.preload = 'none';
        audio.appendChild(source);
        document.body.appendChild(audio);
        const list = this.list.get();
        list[sound._id] = sound;
        this.list.set(list);
    }
    remove(sound) {
        const list = this.list.get();
        delete list[sound._id];
        this.list.set(list);
        const audio = document.querySelector(`#${getCustomSoundId(sound._id)}`);
        audio === null || audio === void 0 ? void 0 : audio.remove();
    }
    getSound(soundId) {
        const list = this.list.get();
        return list[soundId];
    }
    update(sound) {
        const audio = document.querySelector(`#${getCustomSoundId(sound._id)}`);
        if (audio) {
            const list = this.list.get();
            if (!sound.src) {
                sound.src = this.getURL(sound);
            }
            list[sound._id] = sound;
            this.list.set(list);
            const sourceEl = audio.querySelector('source');
            if (sourceEl) {
                sourceEl.src = sound.src;
            }
            audio.load();
        }
        else {
            this.add(sound);
        }
    }
    getURL(sound) {
        return getAssetUrl(`/custom-sounds/${sound._id}.${sound.extension}`, { _dc: sound.random || 0 });
    }
    getList() {
        const list = Object.values(this.list.get());
        return list.sort((a, b) => { var _a, _b; return ((_a = a.name) !== null && _a !== void 0 ? _a : '').localeCompare((_b = b.name) !== null && _b !== void 0 ? _b : ''); });
    }
}
exports.CustomSounds = new CustomSoundsClass();
