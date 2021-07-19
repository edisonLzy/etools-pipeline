// export * from './core';

import { PipeLine } from './core';

const task1 = new PipeLine<{
  name: string
}>();

const task2 = new PipeLine<{
  age: number
}>();

task2
    .tap('测试3', (app, { next }) => {
        console.log('测试3');
        next();
    })
    .tap('测试4', (app, { next }) => {
        console.log('测试4');
        next();
    });

task1
    .tap<{
    age: number
  }>('测试1', (app, { next, skip }) => {
      console.log('run111');
      next();
  })
    .tap('测试2', (app, { next,checkout }) => {
        console.log('run222');
        const { age, name } = app;
        // checkout(task2);
    });

task1.run({
    name: '1'
});
