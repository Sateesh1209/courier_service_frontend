class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element, priority) {
    const item = { element, priority };
    let itemInserted = false;

    for (let i = 0; i < this.queue.length; i++) {
      if (item.priority < this.queue[i].priority) {
        this.queue.splice(i, 0, item);
        itemInserted = true;
        break;
      }
    }

    if (!itemInserted) {
      this.queue.push(item);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}
export default new PriorityQueue();
