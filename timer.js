export class Timer {
  constructor(tickLength = 500) {
    this.tickLength = tickLength;
    this.past = 0;
    this.present = 0;
    this.requestID = 0;
    // Tick will be every half a second
    this.ticks = 0;
    this.events = {};
  }

  start() {
    const present = Date.now();
    const timePassed = present - this.past;
    if (timePassed >= this.tickLength) {
      this.ticks += 1;
      this.past = present;
      this._triggerEvents();
    }
    this.requestID = requestAnimationFrame(this.start.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.requestID);
  }

  every(interval, f, probability = 1) {
    const v = { f, p: probability };
    this.events[interval] =
      this.events[interval] === undefined ? [v] : [...this.events[interval], v];
  }

  setTickLength(v) {
    this.tickLength = v;
  }

  _triggerEvents() {
    const currentTicks = this.ticks;
    for (const [k, v] of Object.entries(this.events)) {
      if (currentTicks % k === 0)
        v.forEach(({ f, p }) => {
          if (Math.random() < p) f();
        });
    }
  }
}
