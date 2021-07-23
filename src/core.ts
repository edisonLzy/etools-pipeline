import { MergeType } from '@em-helper/type';
import { logger } from '@em-cli/shared';
import { TIPS } from './const';
import { LinkNode } from './task-node';

// ! hack: 这里使用 any 而不使用 unknown 是因为 taskQueue 中的fn 类型 和 tap中 中的fn会不兼容

type Obj<T = any> = Record<string, T>

export type Next<T> = (state?: Partial<T>) => void

export type Task<T extends Obj = Obj, O extends Obj = Obj> = (
  state: T,
  context: {
    next: Next<MergeType<T, O>>
    skip: Next<MergeType<T, O>>
  }
) => void
export interface TaskItem<T extends Obj = Obj, O extends Obj = Obj> {
  description: string
  fn: Task<T, O>
}
export class PipeLine<T extends Obj> {
  private headPoint: LinkNode<T> | null = null // 头指针
  private workinPoint: LinkNode<T> | null = null // 当前正在执行task的指针
  private checkoutPoint: LinkNode<T> | null = null // 切出子分支的指针
  private prevState!: T
  constructor () {
      this.headPoint = null;
  }
  private enqueueTask (taskNode: LinkNode<T>) {
      if (this.headPoint) {
          let current = this.headPoint;
          while (current.next) {
              current = current.next;
          }
          current.next = taskNode;
      } else {
          this.headPoint = taskNode;
      }
  }
  tap<O extends Obj> (
      description: string,
      fn: TaskItem<T, O>['fn']
  ): PipeLine<MergeType<T, O>> {
      const task = new LinkNode<T>(description, fn);
      this.enqueueTask(task);
      return this as PipeLine<MergeType<T, O>>;
  }
  /**
   * 跳过下一个任务
   * @param state
   */
  skip = (state: Obj = {}) => {
      if (this.workinPoint && this.workinPoint.next) {
          this.workinPoint.next = this.workinPoint.next.next;
          this.workinPoint = this.workinPoint.next;
      }
      this.processWork(state);
  }
  /**
   * 执行下一个任务
   * @param state 
   */
  next = (state: Obj = {}) => {
      if (this.workinPoint && this.workinPoint !== null) {
          this.workinPoint = this.workinPoint.next;
      }
      this.processWork(state);
  }
  //   /**
  //    * 开始执行分支上的任务
  //    * @param pipeLine 
  //    */
  //   checkout = <P>(pipeLine: PipeLine<P>) => {
  //       if(pipeLine.headPoint){
  //           this.checkoutPoint = this.workinPoint;          
  //           this.workinPoint  = pipeLine.headPoint as any;
  //           this.processWork();
  //       }
  //   }
  /**
   * 开始执行任务 
   * @param context 
   * @returns 
   */
  run (context: T) {
      if (!this.headPoint) return;
      this.workinPoint = this.headPoint;
      this.processWork(context);
  }
  processWork (state: Obj = {}) {
      if(this.workinPoint){
          // 获取 current 需要执行的任务
          const { fn, description } = this.workinPoint.data;
          logger.info(TIPS.start + description);
          this.prevState = {
              ...this.prevState,
              ...state
          };
          fn(this.prevState, {
              next: this.next,
              skip: this.skip,
              //   checkout: this.checkout
          });
      }
  }
}
