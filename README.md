# `usePromise` - A React hook for async data loading with support for Server-Side Rendering

## Usage

```ts
function WhatToWear() {
    const [completed, weather, err] = usePromise(() => weatherApi.getCurrentWeatherAsync());

    if (!completed) {
        return <div>Loading…</div>
    }

    if (!!err) {
        return <div>An error occured…</div>
    }
    
    return <div>Recommended outfit: {weather.temp > 19 ? '👚' : '🧥'}</div>;    
}
```

## SSR

The technique used by this library is to render your React tree until there is no more data to be loaded (up to 10 times). Every time it encountes a new `Promise` scheduled with `usePromise` it will wait until that promise is completed (either resolved or rejected) and then do the next render.

To include it in SSR the usage is pretty similar to popular state libraries.

First wrap your `renderToString` so that you get the rendered string as well as the data for all completed Promises:

```
[rendered, promiseData] = await renderUntilPromisesAreResolved(() => renderToString(<App />));
```

Then make sure the `promiseData` is embedded in the return HTML like this:

```
<script>
  window.__USE_PROMISE_PRELOADED_STATE__ = ${JSON.stringify(promiseData).replace(
    /</g,
    '\\u003c'
  )}
</script>
```

As the `promiseData` is serialized as JSON, it'll be limited to primitive values.

## Questions?

Feel free to open an issue with any question or suggestion!