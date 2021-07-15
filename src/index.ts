// export * from './core';
import { PipeLine } from './core';

const task = new PipeLine<{
  age: number
  name: string
}>();

task
    .tap<{
    a: number
  }>('测试1', ({ name, age}, next) => {
      next();
  })
    .tap<{

    }>('测试2', (app, next) => {
    
        next();
    });

task.run({
    name: '1',
    age: 1
});
