export declare type PromiseResult<T> = [boolean, T?, unknown?];
export declare function usePromise<T>(p: () => Promise<T>, deps?: any[]): PromiseResult<T>;
export declare function renderUntilPromisesAreResolved(f: () => string): Promise<[string, any]>;
