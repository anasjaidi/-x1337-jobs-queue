import { TaskEvent, TaskEventListener } from '../types/events';
import { Task, TaskConfig } from '../types/task';
import { TasksEventEmmiter } from './events';

/**
 * Represents a task queue that manages the execution of tasks with concurrency control.
 */
export class TasksQueue {
  private queue: Task[]; // The queue of tasks to be executed
  private concurrencyLimit: number; // The maximum number of tasks that can be executed concurrently
  private activeTasks: number; // The number of currently active tasks
  private readonly eventEmitter = new TasksEventEmmiter(); // The event emitter for task-related events

  /**
   * Creates a new instance of TasksQueue.
   * @param concurrencyLimit The maximum number of tasks that can be executed concurrently. Default is 1.
   */
  constructor(concurrencyLimit = 1) {
    this.queue = [];
    this.concurrencyLimit = concurrencyLimit;
    this.activeTasks = 0;
  }

  /**
   * Adds an event listener for the specified task event.
   * @param event The task event to listen for.
   * @param listener The listener function to be called when the event is emitted.
   */
  on<T extends TaskEvent>(event: T, listener: TaskEventListener<T>): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Removes an event listener for the specified task event.
   * @param event The task event to remove the listener from.
   * @param listener The listener function to be removed.
   */
  off<T extends TaskEvent>(event: T, listener: TaskEventListener<T>): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Adds a task to the queue.
   * @param task The task function to be executed.
   * @param id The unique identifier for the task.
   * @param config The configuration options for the task. Default is an empty object.
   * @param priority Indicates whether the task should be added to the front of the queue. Default is false.
   */
  public addTask(
    task: (...args: any[]) => any,
    id: string,
    config: TaskConfig = {},
    priority: boolean = false
  ) {
    // Default configuration options
    const defaultConfig: TaskConfig = {
      sync: true,
      context: null,
      args: [],
      execute: true,
      retryOnFail: false,
    };

    // Create a new task entry
    const taskEntry: Task = {
      task,
      id,
      config: { ...defaultConfig, ...config },
    };

    // Add the task to the queue
    if (priority) {
      // Add the task to the front of the queue
      this.queue.unshift(taskEntry);
    } else {
      // Add the task to the end of the queue
      this.queue.push(taskEntry);
    }

    // Emit the 'taskAdded' event
    this.eventEmitter.onTaskAdded(
      {
        id,
        config,
        priority,
      },
      {
        activeTasks: this.activeTasks,
        queueLength: this.queue.length,
      }
    );
  }

  /**
   * Removes the first task from the queue.
   */
  public removeTask() {
    // Remove the first task from the queue
    if (this.queue.length > 0) {
      this.queue.shift();
    }
    // Emit the 'taskRemoved' event
    this.eventEmitter.onTaskRemoved(
      {},
      {
        activeTasks: this.activeTasks,
        queueLength: this.queue.length,
      }
    );
  }

  /**
   * Handles the completion of a task.
   * @param id The unique identifier of the completed task.
   * @param config The configuration options of the completed task.
   */
  private onCompletedTask(id: string, config: TaskConfig) {
    // Emit the 'taskCompleted' event
    this.eventEmitter.onTaskCompleted(
      {
        id,
        config,
      },
      {
        activeTasks: this.activeTasks,
        queueLength: this.queue.length,
      }
    );

    // Decrement the number of active tasks
    this.activeTasks--;

    // Run the next task in the queue
    this.run();
  }

  /**
   * Handles the failure of a task.
   * @param task The task function that failed.
   * @param id The unique identifier of the failed task.
   * @param config The configuration options of the failed task.
   * @param error The error object representing the failure.
   */
  private onFailedTask(
    task: (...args: any[]) => any,
    id: string,
    config: TaskConfig,
    error: Error
  ) {
    // Emit the 'taskFailed' event
    this.eventEmitter.onTaskFailed(
      {
        id,
        config,
        error,
      },
      {
        activeTasks: this.activeTasks,
        queueLength: this.queue.length,
      }
    );

    // run onFailed callback
    config.onError?.(error);

    // Retry the task if the retry count is greater than 0
    if (config.retryOnFail && config.retryCount > 0) {
      // run onRetry callback
      config.onRetry?.(error, config.retryCount);

      // Emit the 'taskRetrying' event
      this.eventEmitter.onTaskRetrying(
        {
          id,
          config,
          count: config.retryCount,
          error,
        },
        {
          activeTasks: this.activeTasks,
          queueLength: this.queue.length,
        }
      );

      // Add the task back to the front of  queue with a reduced retry count
      this.addTask(
        task,
        id,
        {
          ...config,
          retryCount: config.retryCount! - 1,
        },
        true
      );
    }
  }

  /**
   * Executes an asynchronous task.
   * @param task The task function to be executed.
   * @param id The unique identifier of the task.
   * @param config The configuration options of the task.
   */
  private async executeAsyncTask(
    task: (...args: any[]) => any,
    id: string,
    config: TaskConfig
  ) {
    // Execute the task asynchronously
    const data = await task.apply(config.context, config.args);

    // run onSuccess callback
    config.onSuccess?.(data);
  }

  /**
   * Runs the task queue.
   */
  public async run() {
    // Check if the queue is empty or full
    if (this.queue.length === 0) {
      // Emit the 'queueEmpty' event
      this.eventEmitter.onQueueEmpty({});
      return;
    } else if (this.activeTasks >= this.concurrencyLimit) {
      // Emit the 'queueFull' event
      this.eventEmitter.onQueueFull({});
      return;
    }

    // Increment the number of active tasks
    this.activeTasks++;

    // Get the first task in the queue
    const { task, config, id } = this.queue.shift()!; // Get and remove the first task

    // Execute the task
    try {
      // Emit the 'taskStarted' event
      this.eventEmitter.onTaskStarted(
        {
          id,
          config,
        },
        {
          activeTasks: this.activeTasks,
          queueLength: this.queue.length,
        }
      );
      // Execute the task based on the configuration
      if (config.sync) {
        // Execute the task synchronously
        task.apply(config.context, config.args);
        this.onCompletedTask(id, config);
      } else if (config.sync === false) {
        // Execute the task asynchronously
        const callback = () => {
          this.executeAsyncTask(task, id, config).then(() => {
            this.onCompletedTask(id, config);
          });
        };

        // Execute the task based on the execution context
        switch (config.executeIn) {
          // Execute the task in the microtask queue
          case 'microTasks':
            await queueMicrotask(callback);
            break;

          // Execute the task in the callback queue
          case 'callback':
            await setTimeout(callback, config.timeout);
            break;
        }
      }
    } catch (error) {
      // Handle the failure of the task
      this.onFailedTask(task, id, config, error);
    } finally {
      // run finally callback
      config.finally?.();

      // Handle the completion of the task
    }
  }
}