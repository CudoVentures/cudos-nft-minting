export default class WorkerQueueHelper {

    queue: Runnable[];
    working: boolean;

    constructor() {
        this.queue = [];
        this.working = false;
    }

    pushAndExecute(runnable: Runnable) {
        this.queue.push(runnable);
        this.signal();
    }

    signal() {
        if (this.working === true) {
            return;
        }

        this.run();
    }

    async run() {
        this.working = true;

        while (this.queue.length > 0) {
            const runnable = this.queue.shift();
            try {
                const result = await runnable.run();
                await runnable.onFinish(result);
            } catch (e) {
                await runnable.onError();
            }
        }

        this.working = false;
    }

}

export class Runnable {

    run: () => void;
    onFinish: (params: any) => void;
    onError: () => void;

    constructor(run: () => any, onFinish: (params: any) => void, onError: () => void) {
        this.run = run;
        this.onFinish = onFinish;
        this.onError = onError;
    }

}
