import { logger } from '@em-cli/shared';
import { MergeType } from '@em-helper/type';
import { TIPS } from './const';

// ! hack: 这里使用 any 而不使用 unknown 是因为 taskQueue 中的fn 类型 和 tap中 中的fn会不兼容

type Obj<T = any> = Record<string, T>

export type Next<T> = (state?: Partial<T>) => void

export type Task<T extends Obj, O extends Obj> = (context: T, next: Next<MergeType<T, O>>) => void
export interface TaskItem<T extends Obj = Obj, O extends Obj = Obj> {
    description: string
    fn: Task<T, O>
}
export class PipeLine<T extends Obj> {
    private taskQueue: TaskItem<T>[] = [];
    private _taskQueue: TaskItem<T>[] = [];
    private prevState!: T;
    *[Symbol.iterator](){
        yield * this._taskQueue;
    }
    tap<O extends Obj>
    (description: string, fn: TaskItem<T, O>['fn']): PipeLine<MergeType<T, O>> {
        this.taskQueue.push({
            description,
            fn
        });
        this._taskQueue.push({
            description,
            fn
        });
        return this as PipeLine<MergeType<T, O>>;
    }
    run(context: T) {
        if (this.taskQueue.length === 0) {
            logger.error('taskQueue is empty');
            return;
        }
        const done = (state: Obj = {}) => {
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
            fn(this.prevState, (innerState: Obj = {}) => {
                logger.done(TIPS.end + description);
                done(innerState);
            });
        };
        done(context);
    }
}

