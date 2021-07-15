# em-pipeline

```ts
import { PipeLine } from './core';

const task = new PipeLine<{
   name: string
}>();

task
    .tap<{
    a: number
  }>('测试1', (app, next) => {
      next({
          a: 1
      });
  })
    .tap('测试2', (app, next) => {
        // next();
    });

task.run({
    name: '1',
});

for (const iterator of task) {
    console.log(iterator);
}

```
