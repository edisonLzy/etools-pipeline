import { PipeLine } from '../src/core';

test('状态传递', () => {
  const task = new PipeLine<{
    count: number;
  }>();
  task
    .tap<{
      age: number;
    }>('测试1', (app, { next }) => {
      const { count } = app;
      const age = 1;
      expect(count).toBe(0);
      next({
        count: count + 1,
        age: age,
      });
    })
    .tap('测试2', (app, { next }) => {
      const { count, age } = app;
      expect(count).toBe(1);
      expect(count).toBe(1);
    });
  task.run({
    count: 0,
  });
});

test('skip: 跳过下一个任务', () => {
  const task = new PipeLine();
  let count = 0;
  task
    .tap('测试1', (app, { next, skip }) => {
      count++;
      skip();
    })
    .tap('测试2', (app, { next }) => {
      count++;
    })
    .tap('测试3', (app, { next }) => {
      count++;
    });
  task.run();
  expect(count).toBe(2);
});

test('next 执行下一个任务', () => {
  const task = new PipeLine();
  let count = 0;
  task
    .tap('测试1', (app, { next }) => {
      count++;
      next();
    })
    .tap('测试2', (app, { next }) => {
      count++;
    })
    .tap('测试3', (app, { next }) => {
      // 测试3将不会执行
      count++;
    });
  task.run();
  expect(count).toBe(2);
});
