export default class TimeoutHelper {

    timeout: number;
    timer: any;

    constructor(timeout_ = 500) {
        this.timeout = timeout_;
        this.timer = null;
    }

    signal(callback) {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, this.timeout);
    }

}
