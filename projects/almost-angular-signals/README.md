# almost-angular-signals

```ts
const count = $signal(0);
count.get(); // 0

count.set(1);
count.get(); // 1

count.update((v) => v + 1);
count.get(); // 2
```
