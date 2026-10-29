import { toast as sonnerToast } from 'sonner';

export const toast: typeof sonnerToast = new Proxy(sonnerToast, {
  apply(target, thisArg, argumentsList) {
    target.dismiss();
    return Reflect.apply(target, thisArg, argumentsList);
  },
  get(target, property, receiver) {
    const method = Reflect.get(target, property, receiver);
    if (typeof method !== 'function' || property === 'dismiss' || property === 'getHistory') {
      return method;
    }

    return (...args: unknown[]) => {
      target.dismiss();
      return Reflect.apply(method, target, args as never[]);
    };
  },
});
