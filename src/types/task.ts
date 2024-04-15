/**
 * Represents the base configuration for a task.
 */
export interface TaskConfigBase {
  context?: any;
  args?: any[];
  execute?: boolean;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onRetry?: (error: Error, count: number) => void;
  finally?: () => void;
}

/**
 * Represents the base configuration for task retry.
 * @template T - A boolean type indicating whether retry is enabled or disabled.
 */
type TaskRetryConfigBase<T extends boolean> = T extends true
  ? {
      retryOnFail: true;
      retryCount: number;
    }
  : {
      retryOnFail?: false;
      retryCount?: never;
    };

/**
 * Represents the configuration for task retry.
 */
export type TaskRetryConfig =
  | TaskRetryConfigBase<true>
  | TaskRetryConfigBase<false>;

/**
 * Represents the configuration for executing a task.
 */
type ExecuteInConfig =
  | {
      executeIn: 'callback';
      timeout: number;
    }
  | {
      executeIn: 'microTasks';
      timeout?: never;
    };

/**
 * Represents the base configuration for synchronous task execution.
 * @template T - A boolean type indicating whether synchronous execution is enabled or disabled.
 */
export type TaskSyncConfigBase<T extends boolean> = T extends true
  ? { sync?: true }
  : {
      sync: false;
    } & ExecuteInConfig;

/**
 * Represents the configuration for synchronous task execution.
 */
export type TaskSyncConfig =
  | TaskSyncConfigBase<true>
  | TaskSyncConfigBase<false>;

/**
 * Represents the complete configuration for a task.
 */
export type TaskConfig = TaskConfigBase & TaskRetryConfig & TaskSyncConfig;

/**
 * Represents a task.
 */
export interface Task {
  task: (...args: any[]) => any;
  id: string;
  config: TaskConfig;
}
