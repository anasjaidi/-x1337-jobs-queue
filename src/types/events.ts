import { TaskConfig } from './task';

export interface EventMetadata {
  queueLength: number;
  activeTasks: number;
}

/**
 * Payload for the 'taskAdded' event.
 */
export interface OnTaskAddedEventPayload {
  id: string;
  config: TaskConfig;
  priority: boolean;
}

/**
 * Payload for the 'taskStarted' event.
 */
export interface OnTaskStartedEventPayload {
  id: string;
  config: TaskConfig;
}

/**
 * Payload for the 'taskCompleted' event.
 */
export interface OnTaskCompletedEventPayload {
  id: string;
  config: TaskConfig;
}

/**
 * Payload for the 'taskFailed' event.
 */
export interface OnTaskFailedEventPayload {
  id: string;
  config: TaskConfig;
  error: Error;
}

/**
 * Payload for the 'taskRetrying' event.
 */
export interface OnTaskRetryingEventPayload {
  id: string;
  config: TaskConfig;
  count: number;
  error: Error;
}

/**
 * Payload for the 'taskRemoved' event.
 */
export interface OnTaskRemovedEventPayload {}

/**
 * Payload for the 'queueEmpty' event.
 */
export interface OnQueueEmptyEventPayload {}

/**
 * Payload for the 'queueFull' event.
 */
export interface OnQueueFullEventPayload {}

/**
 * Type definition for the event listener of the 'taskAdded' event.
 */
export type OnTaskAddedEventListener = (
  data: OnTaskAddedEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Type definition for the event listener of the 'taskStarted' event.
 */
export type OnTaskStartedEventListener = (
  data: OnTaskStartedEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Type definition for the event listener of the 'taskCompleted' event.
 */
export type OnTaskCompletedEventListener = (
  data: OnTaskCompletedEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Type definition for the event listener of the 'taskFailed' event.
 */
export type OnTaskFailedEventListener = (
  data: OnTaskFailedEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Type definition for the event listener of the 'taskRetrying' event.
 */
export type OnTaskRetryingEventListener = (
  data: OnTaskRetryingEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Type definition for the event listener of the 'taskRemoved' event.
 */
export type OnTaskRemovedEventListener = (
  data: OnTaskRemovedEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Type definition for the event listener of the 'queueEmpty' event.
 */
export type OnQueueEmptyEventListener = (
  data: OnQueueEmptyEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Type definition for the event listener of the 'queueFull' event.
 */
export type OnQueueFullEventListener = (
  data: OnQueueFullEventPayload,
  metadata?: EventMetadata
) => void;

/**
 * Union type representing all possible task events.
 */
export type TaskEvent =
  | 'taskAdded'
  | 'taskStarted'
  | 'taskCompleted'
  | 'taskFailed'
  | 'taskRetrying'
  | 'queueEmpty'
  | 'queueFull'
  | 'taskRemoved';

/**
 * Type representing the mapping between event names and their corresponding listener or payload types.
 */
type MapType = 'listener' | 'payload';

/**
 * Type representing the mapping between event names and their corresponding listener or payload types.
 */
export type TaskEventListenerMap<T extends MapType> = {
  taskAdded: T extends 'listener'
    ? OnTaskAddedEventListener
    : OnTaskAddedEventPayload;
  taskStarted: T extends 'listener'
    ? OnTaskStartedEventListener
    : OnTaskStartedEventPayload;
  taskCompleted: T extends 'listener'
    ? OnTaskCompletedEventListener
    : OnTaskCompletedEventPayload;
  taskFailed: T extends 'listener'
    ? OnTaskFailedEventListener
    : OnTaskFailedEventPayload;
  taskRetrying: T extends 'listener'
    ? OnTaskRetryingEventListener
    : OnTaskRetryingEventPayload;
  taskRemoved: T extends 'listener'
    ? OnTaskRemovedEventListener
    : OnTaskRemovedEventPayload;
  queueEmpty: T extends 'listener'
    ? OnQueueEmptyEventListener
    : OnQueueEmptyEventPayload;
  queueFull: T extends 'listener'
    ? OnQueueFullEventListener
    : OnQueueFullEventPayload;
};

/**
 * Type representing the event listener for a specific task event.
 */
export type TaskEventListener<T extends TaskEvent> =
  TaskEventListenerMap<'listener'>[T];

/**
 * Type representing the payload for a specific task event.
 */
export type TaskEventPayload<T extends TaskEvent> =
  TaskEventListenerMap<'payload'>[T];
