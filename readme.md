# em-pipeline

```ts
import { PipeLine } from './core'

const task1 = new PipeLine<{
  name: string
}>()

task1
  .tap<{
    age: number
  }>('测试1', (app, { next, skip }) => {
    console.log('run111')
    next({
      age: 18
    })
  })
  .tap<{
    sex: string
  }>('测试2', (app, { next, skip }) => {
    console.log('run222')
    const { age, name } = app
    skip({
      sex: 'man'
    })
  })
  .tap('测试5', (app, { next }) => {
    console.log(app)
    next()
  })
  .tap('测试6', app => {
    console.log(app)
  })

task1.run({
  name: '1'
})
```
