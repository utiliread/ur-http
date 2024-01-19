type Callback<P extends any[] = any[]> = (...params: P) => void | Promise<void>;

export class EventAggregator<P extends any[]> {
  private callbacks: Function[] = [];

  get any() {
    return this.callbacks.length > 0;
  }

  subscribe(callback: Callback<P>): Subscription {
    this.callbacks.push(callback);
    return {
      dispose: () => {
        const index = this.callbacks.indexOf(callback);
        if (index >= 0) {
          this.callbacks.splice(index, 1);
        }
      },
    };
  }

  async publish(...params: P) {
    const callbacks = this.callbacks.slice();
    for (const callback of callbacks) {
      await Promise.resolve(callback.apply(this, params));
    }
  }
}

export interface Subscription {
  dispose(): void;
}
