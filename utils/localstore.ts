export class LocalStore {
  constructor(private readonly window: Window) {}
  getItem<T>(key: string) {
    const stored = this.window.localStorage.getItem(key);
    const user = stored ? JSON.parse(stored) : null;
    return user as T | null;
  }
  storeItem(item: object, name: string) {
    this.window.localStorage.setItem(JSON.stringify(item), name);
  }
}
