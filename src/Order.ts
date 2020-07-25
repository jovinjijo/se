export class Order {
  private time: Date;

  constructor(time?: Date) {
    if (time) {
      this.time = time;
    } else {
      const a = new Date();
      this.time = a;
    }
  }

  getTime() {
    return this.time;
  }
}
