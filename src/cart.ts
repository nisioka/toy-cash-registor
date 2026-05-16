import type { Product } from './product';

export class Cart {
  private items: Product[] = [];

  add(item: Product): void {
    this.items.push(item);
  }

  total(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  count(): number {
    return this.items.length;
  }

  reset(): void {
    this.items = [];
  }
}
