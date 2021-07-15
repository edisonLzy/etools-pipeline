"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeLine = void 0;
const shared_1 = require("@em-cli/shared");
const const_1 = require("./const");
class PipeLine {
    taskQueue = [];
    prevState;
    tap(description, fn) {
        this.taskQueue.push({
            description,
            fn
        });
        return this;
    }
    run(context) {
        if (this.taskQueue.length === 0) {
            shared_1.logger.error('taskQueue is empty');
            return;
        }
        const done = (state = {}) => {
            if (this.taskQueue.length === 0)
                return;
            const taskItem = this.taskQueue.shift();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { description, fn } = taskItem;
            shared_1.logger.info(const_1.TIPS.start + description);
            // 合并传入的 state 和 上次的state
            this.prevState = {
                ...this.prevState,
                ...state
            };
            fn(this.prevState, (innerState = {}) => {
                shared_1.logger.done(const_1.TIPS.end + description);
                done(innerState);
            });
        };
        done(context);
    }
}
exports.PipeLine = PipeLine;
