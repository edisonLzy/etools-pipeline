# nodeJS 流水线任务
* [] 函数是异步如何处理

```ts
const task = new PipeLine<{
    name: number
}>();

const wait = (delay:number) => {
    return new Promise((resolve, reject) =>{
       setTimeout(() =>{
          resolve(1)
       },delay)
    })
}
task
    .tap('task1', function (context, done) {
        const { name } = context
        console.log(context);
        done({
            age: 18,
            name
        }) // 执行下个任务
    })
    .tap('task2', async function (context, done) {
        const { app } = context
        console.log(context);
        await wait(2000)
    })
    .tap('task3',async  function (context,done) {
    })
task.run({
    name: 1
})

```
