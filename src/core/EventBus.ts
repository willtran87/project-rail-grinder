/**
 * EventBus - Simple publish/subscribe system for decoupling game systems.
 *
 * Systems emit events (e.g., "grind-contact") and other systems listen
 * without needing direct references to each other.
 */

type EventCallback = (...args: unknown[]) => void;

export class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /** Subscribe to an event. Returns an unsubscribe function. */
  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /** Emit an event to all subscribers */
  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const cb of callbacks) {
        cb(...args);
      }
    }
  }

  /** Remove all listeners for an event, or all listeners if no event specified */
  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Single global event bus for the game
export const eventBus = new EventBus();
