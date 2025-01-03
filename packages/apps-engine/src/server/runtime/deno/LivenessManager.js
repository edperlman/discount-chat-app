"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivenessManager = void 0;
const stream_1 = require("stream");
const COMMAND_PING = '_zPING';
const defaultOptions = {
    pingRequestTimeout: 10000,
    pingFrequencyInMS: 10000,
    consecutiveTimeoutLimit: 4,
    maxRestarts: Infinity,
};
/**
 * Responsible for pinging the Deno subprocess and for restarting it
 * if something doesn't look right
 */
class LivenessManager {
    constructor(deps, options = {}) {
        this.pingTimeoutConsecutiveCount = 0;
        this.restartCount = 0;
        this.restartLog = [];
        this.controller = deps.controller;
        this.messenger = deps.messenger;
        this.debug = deps.debug;
        this.pingAbortController = new stream_1.EventEmitter();
        this.options = Object.assign({}, defaultOptions, options);
    }
    getRuntimeData() {
        const { restartCount, pingTimeoutConsecutiveCount, restartLog } = this;
        return {
            restartCount,
            pingTimeoutConsecutiveCount,
            restartLog,
        };
    }
    attach(deno) {
        this.subprocess = deno;
        this.pingTimeoutConsecutiveCount = 0;
        this.controller.once('ready', () => this.ping());
        this.subprocess.once('exit', this.handleExit.bind(this));
    }
    /**
     * Start up the process of ping/pong for liveness check
     *
     * The message exchange does not use JSON RPC as it adds a lot of overhead
     * with the creation and encoding of a full object for transfer. By using a
     * string the process is less intensive.
     */
    ping() {
        const start = Date.now();
        let aborted = false;
        const setAborted = () => {
            this.debug('Ping aborted');
            aborted = true;
        };
        // If we get an abort, ping should not continue
        this.pingAbortController.once('abort', setAborted);
        new Promise((resolve, reject) => {
            const onceCallback = () => {
                this.debug('Ping successful in %d ms', Date.now() - start);
                clearTimeout(timeoutId);
                this.pingTimeoutConsecutiveCount = 0;
                resolve();
            };
            const timeoutCallback = () => {
                this.debug('Ping failed in %d ms (consecutive failure #%d)', Date.now() - start, this.pingTimeoutConsecutiveCount);
                this.controller.off('pong', onceCallback);
                this.pingTimeoutConsecutiveCount++;
                reject('timeout');
            };
            const timeoutId = setTimeout(timeoutCallback, this.options.pingRequestTimeout);
            this.controller.once('pong', onceCallback);
        })
            .then(() => !aborted)
            .catch((reason) => {
            if (aborted) {
                return false;
            }
            if (reason === 'timeout' && this.pingTimeoutConsecutiveCount >= this.options.consecutiveTimeoutLimit) {
                this.debug('Subprocess failed to respond to pings %d consecutive times. Attempting restart...', this.options.consecutiveTimeoutLimit);
                this.restartProcess('Too many pings timed out');
                return false;
            }
            return true;
        })
            .then((shouldContinue) => {
            if (!shouldContinue) {
                this.pingAbortController.off('abort', setAborted);
                return;
            }
            setTimeout(() => {
                if (aborted)
                    return;
                this.pingAbortController.off('abort', setAborted);
                this.ping();
            }, this.options.pingFrequencyInMS);
        });
        this.messenger.send(COMMAND_PING);
    }
    handleExit(exitCode, signal) {
        this.pingAbortController.emit('abort');
        const processState = this.controller.getProcessState();
        // If the we're restarting the process, or want to stop the process, or it exited cleanly, nothing else for us to do
        if (processState === 'restarting' || processState === 'stopped' || (exitCode === 0 && !signal)) {
            return;
        }
        let reason;
        // Otherwise we try to restart the subprocess, if possible
        if (signal) {
            this.debug('App has been killed (%s). Attempting restart #%d...', signal, this.restartCount + 1);
            reason = `App has been killed with signal ${signal}`;
        }
        else {
            this.debug('App has exited with code %d. Attempting restart #%d...', exitCode, this.restartCount + 1);
            reason = `App has exited with code ${exitCode}`;
        }
        this.restartProcess(reason);
    }
    restartProcess(reason) {
        if (this.restartCount >= this.options.maxRestarts) {
            this.debug('Limit of restarts reached (%d). Aborting restart...', this.options.maxRestarts);
            this.controller.stopApp();
            return;
        }
        this.pingTimeoutConsecutiveCount = 0;
        this.restartCount++;
        this.restartLog.push({
            reason,
            restartedAt: new Date(),
            source: 'liveness-manager',
            pid: this.subprocess.pid,
        });
        this.controller.restartApp();
    }
}
exports.LivenessManager = LivenessManager;