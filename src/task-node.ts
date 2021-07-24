import type {Task,TaskItem} from './core';
export class LinkNode<T>{
  next:this | null = null
  data:TaskItem<T>
  constructor(description: string,fn:Task<T>){
      this.data = {
          description,
          fn
      };
  }
}