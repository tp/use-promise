export declare type PromiseResult<T> = {
    loading: true;
    error?: undefined;
    data?: undefined;
} | {
    loading: false;
    error?: any | undefined;
    data?: T | undefined;
};
export declare function usePromise<T>(p: () => Promise<T>, deps?: any[]): PromiseResult<T>;
export declare function renderUntilPromisesAreResolved(f: () => string): Promise<[string, any]>;
