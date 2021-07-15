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
    private taskGenerator:Generator; 
    private taskQueue: TaskItem<T>[] = [];
    private _taskQueue: TaskItem<T>[] = [];
    private prevState!: T;
    constructor(){
        // 初始化生成器对象
        this.taskGenerator = this.createTask();   
    }
    tap<O extends Obj>
    (description: string, fn: any ): PipeLine<MergeType<T, O>> {
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
        const {done,value} = this.taskGenerator.next();
        const {fn,description} = value;
        logger.info(TIPS.start + description );
        fn(context,this.taskGenerator);
        logger.info(TIPS.end + description );
        
    }
    private * createTask(){
        yield * this.taskQueue;
    }

    *[Symbol.iterator](){
        yield * this._taskQueue;
    }
    
}

