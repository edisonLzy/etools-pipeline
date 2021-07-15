export declare type Next<T> = (state?: WithOtherProps<Partial<T>>) => void;
export declare type WithOtherProps<T> = T & Record<string, unknown>;
export declare type Task<T = unknown> = (context: WithOtherProps<T>, next: Next<T>) => void;
export interface TaskItem<T> {
    description: string;
    fn: Task<T>;
}
export declare class PipeLine<T extends Record<string, unknown>> {
    private taskQueue;
    private prevState;
    tap(description: string, fn: TaskItem<T>['fn']): this;
    run(context: T): void;
}
