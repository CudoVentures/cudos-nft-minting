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
            const result = await runnable.run();
            await runnable.onFinish(result);
        }

        this.working = false;
    }

}

export class Runnable {

    run: () => void;
    onFinish: (params: any) => void;

    constructor(run: () => any, onFinish: (params: any) => void) {
        this.run = run;
        this.onFinish = onFinish;
    }

}
