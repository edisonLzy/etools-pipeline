import { logger } from '@em-cli/shared';
import { TIPS } from './const';
export type Next<T> = (state?: WithOtherProps<Partial<T>>) => void
export type WithOtherProps<T> = T & Record<string, unknown>;
export type Task<T = unknown> = (context: WithOtherProps<T>, next: Next<T>) => void
export interface TaskItem<T> {
    description: string
    fn: Task<T>
}
export class PipeLine<T extends Record<string, unknown>> {
    private taskQueue: TaskItem<T>[] = [];
    private prevState!: WithOtherProps<T>
    tap(description: string, fn: TaskItem<T>['fn']) {
        this.taskQueue.push({
            description,
            fn
        });
        return this;
    }
    run(context: T) {
        if (this.taskQueue.length === 0) {
            logger.error('taskQueue is empty');
            return;
        }
        const done = (state: Record<string, unknown> = {}) => {
            if (this.taskQueue.length === 0) return;
            const taskItem = this.taskQueue.shift();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { description, fn } = taskItem!;
            logger.info(TIPS.start + description);
            // 合并传入的 state 和 上次的state
            this.prevState = {
                ...this.prevState,
                ...state
            };
            fn(this.prevState, (innerState: Record<string, unknown> = {}) => {
                logger.done(TIPS.end + description);
                done(innerState);
            });
        };
        done(context);
    }
}

