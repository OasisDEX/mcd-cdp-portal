declare module "hooks/useObservable" {
  export interface WatchInterface extends WatchInterfaceMcd {
    _extendWithAdditionalFunctionsHere(): void;
  }
  export const watch: WatchInterface;
}
