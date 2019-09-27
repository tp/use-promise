import React, { useState, useEffect } from 'react';

// Error is guaranteed to be neither truthy in the error case
export type PromiseResult<T> =
  { loading: true, error?: undefined, data?: undefined } |
  { loading: false, error: Error, data?: undefined } |
  { loading: false, error?: undefined, data: T };

// Global to be (re)set before each rendering
let ongoingPromises: Array<PromiseResult<any>> | undefined;
let counter = 0;

export function usePromise<T>(p: () => Promise<T>, deps: any[] = []): PromiseResult<T> {
  if (typeof window !== 'undefined') {
    // Client / browser implementation
    const preloadedState = (window as any).__USE_PROMISE_PRELOADED_STATE__ as PromiseResult<T>[];

    const preloadedDataForPromise = preloadedState.shift();

    const [state, setState] = useState<PromiseResult<T>>(preloadedDataForPromise || { loading: true });

    useEffect(() => {
      if (preloadedDataForPromise) {
        return;
      } else {
        p()
          .then(value => setState({ loading: false, data: value }))
          .catch(reason => {
            const error = reason instanceof Error ? reason : new Error(`${reason}`);

            setState({ loading: false, error: error });
          });
      }
    }, deps);

    return state;
  } else {
    // SSR implementation
    if (!ongoingPromises) {
      throw new Error(`"completedPromises" not set before entering "usePromise"`);
    }

    const currentIndex = counter;
    counter++;

    if (!ongoingPromises[currentIndex]) {

      throw p();
    }

    if (ongoingPromises[currentIndex].loading) {
      throw new Error('Unexpected state, expected promise to be done');
    }

    return ongoingPromises[currentIndex];
  }
}

export async function renderUntilPromisesAreResolved(f: () => string): Promise<[string, any]> {
  let rendered: string = '';
  let renderAttempts = 0;

  const _ongoingPromises: Array<PromiseResult<any>> = [];

  while (true) {
    if (renderAttempts > 10) {
      throw new Error('Rendering still not finished after 10 renders.');
    }
    renderAttempts++;

    counter = 0;
    ongoingPromises = _ongoingPromises;
    try {
      ongoingPromises = _ongoingPromises;

      rendered = f();

      break;
    } catch (renderError) {
      ongoingPromises = undefined; // reset before await of Promise

      if (renderError instanceof Promise) {
        try {
          const result = await renderError;

          _ongoingPromises.push({ loading: false, data: result });
        } catch (e) {
          _ongoingPromises.push({ loading: false, error: e });
        }

        continue;
      }

      throw renderError;
    } finally {
      ongoingPromises = undefined;
    }
  }

  return [rendered, _ongoingPromises];
}
