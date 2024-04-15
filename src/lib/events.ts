import { EventEmitter } from 'events';
import {
  OnTaskAddedEventPayload,
  OnTaskRemovedEventPayload,
  OnQueueFullEventPayload,
  OnTaskCompletedEventPayload,
  OnTaskFailedEventPayload,
  OnTaskRetryingEventPayload,
  OnQueueEmptyEventPayload,
  OnTaskStartedEventPayload,
  TaskEvent,
  EventMetadata,
  TaskEventListener,
} from '../types/events';

/**
 * Custom event emitter for tasks.
 */
export class TasksEventEmmiter extends EventEmitter<{
  taskAdded: [OnTaskAddedEventPayload, EventMetadata?];
  queueFull: [OnQueueFullEventPayload, EventMetadata?];
  taskCompleted: [OnTaskCompletedEventPayload, EventMetadata?];
  taskFailed: [OnTaskFailedEventPayload, EventMetadata?];
  taskRetrying: [OnTaskRetryingEventPayload, EventMetadata?];
  queueEmpty: [OnQueueEmptyEventPayload, EventMetadata?];
  taskRemoved: [OnTaskRemovedEventPayload, EventMetadata?];
  taskStarted: [OnTaskStartedEventPayload, EventMetadata?];
}> {
  /**
   * Event handler for when a task is added.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onTaskAdded(payload: OnTaskAddedEventPayload, metadata?: EventMetadata) {
    this.emit('taskAdded', payload, metadata);
  }

  /**
   * Event handler for when the queue is full.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onQueueFull(payload: OnQueueFullEventPayload, metadata?: EventMetadata) {
    this.emit('queueFull', payload, metadata);
  }

  /**
   * Event handler for when a task is completed.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onTaskCompleted(
    payload: OnTaskCompletedEventPayload,
    metadata?: EventMetadata
  ) {
    this.emit('taskCompleted', payload, metadata);
  }

  /**
   * Event handler for when a task fails.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onTaskFailed(payload: OnTaskFailedEventPayload, metadata?: EventMetadata) {
    this.emit('taskFailed', payload, metadata);
  }

  /**
   * Event handler for when a task is retrying.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onTaskRetrying(
    payload: OnTaskRetryingEventPayload,
    metadata?: EventMetadata
  ) {
    this.emit('taskRetrying', payload, metadata);
  }

  /**
   * Event handler for when the queue is empty.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onQueueEmpty(payload: OnQueueEmptyEventPayload, metadata?: EventMetadata) {
    this.emit('queueEmpty', payload, metadata);
  }

  /**
   * Event handler for when a task is removed.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onTaskRemoved(payload: OnTaskRemovedEventPayload, metadata?: EventMetadata) {
    this.emit('taskRemoved', payload, metadata);
  }

  /**
   * Event handler for when a task is started.
   * @param payload - The payload of the event.
   * @param metadata - The metadata of the event.
   */
  onTaskStarted(payload: OnTaskStartedEventPayload, metadata?: EventMetadata) {
    this.emit('taskStarted', payload, metadata);
  }

  /**
   * Overrides the `on` method of the EventEmitter class to provide type safety.
   * @param event - The event to listen for.
   * @param listener - The listener function to be called when the event is emitted.
   * @returns The current instance of the TasksEventEmmiter class.
   */
  on(event: TaskEvent, listener: TaskEventListener<typeof event>): this;

  /**
   * Overrides the `on` method of the EventEmitter class to provide type safety.
   * @param event - The event to listen for.
   * @param listener - The listener function to be called when the event is emitted.
   * @returns The current instance of the TasksEventEmmiter class.
   */
  on(event: TaskEvent, listener: TaskEventListener<typeof event>) {
    super.on(event, listener as any);
    return this;
  }

  /**
   * Overrides the `off` method of the EventEmitter class to provide type safety.
   * @param event - The event to remove the listener from.
   * @param listener - The listener function to be removed.
   * @returns The current instance of the TasksEventEmmiter class.
   */
  off(event: TaskEvent, listener: TaskEventListener<typeof event>): this;

  /**
   * Overrides the `off` method of the EventEmitter class to provide type safety.
   * @param event - The event to remove the listener from.
   * @param listener - The listener function to be removed.
   * @returns The current instance of the TasksEventEmmiter class.
   */
  off(event: TaskEvent, listener: TaskEventListener<typeof event>) {
    super.off(event, listener as any);
    return this;
  }
}
