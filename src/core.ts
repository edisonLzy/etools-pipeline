import { logger } from '@em-cli/shared';
import { TIPS } from './const';
export type Next<T> = (state?:Partial<T>) => void
export type WithOtherProps<T> = T & Record<string, unknown>;
export type Task<T extends Obj, O extends Obj = Obj > = (context: MergeType<T,O>, next: Next<MergeType<T,O>>) => void

type Obj<T = unknown> =  Record<string,T>

type MergeType<T extends Record<string,unknown>,K extends Record<string,unknown>> = {
    [P in keyof T | keyof K]: P extends keyof K ? K[P] : P extends keyof T ? T[P]:never;
  }
export interface TaskItem<T extends Obj = Obj ,O extends Obj = Obj> {
    description: string
    fn: Task<T,O>
}


export class PipeLine<T extends Record<string,unknown> = Record<string,unknown>> {
    private taskQueue: TaskItem<T>[] = [];
    private prevState!: WithOtherProps<T>
    tap<O extends Record<string,unknown> = Record<string,unknown> >(description: string, fn: TaskItem<T,O>['fn']):PipeLine<MergeType<T,O>> {
        // this.taskQueue.push({
        //     description,
        //     fn
        // });
        return this as PipeLine<MergeType<T,O>> ;
    }
    run(context: T) {
        // if (this.taskQueue.length === 0) {
        //     logger.error('taskQueue is empty');
        //     return;
        // }
        // const done = (state: Record<string, unknown> = {}) => {
        //     if (this.taskQueue.length === 0) return;
        //     const taskItem = this.taskQueue.shift();
        //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //     const { description, fn } = taskItem!;
        //     logger.info(TIPS.start + description);
        //     // 合并传入的 state 和 上次的state
        //     this.prevState = {
        //         ...this.prevState,
        //         ...state
        //     };
        //     fn(this.prevState, (innerState: Record<string, unknown> = {}) => {
        //         logger.done(TIPS.end + description);
        //         done(innerState);
        //     });
        // };
        // done(context);
    }
    done(){
        console.log('done');     
    }
}

