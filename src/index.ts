// export * from './core';

import { PipeLine } from './core';

const task = new PipeLine<{
   name: string
}>();

task
    .tap('测试1', (app:any, bpp:any) => {
        console.log(bpp.next());
        bpp.next();
       
    })
    .tap('测试2', (app:any, {next}:any)  => {
        // next();
    });

task.run({
    name: '1',
});

