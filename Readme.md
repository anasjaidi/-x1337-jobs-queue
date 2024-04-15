<!-- # Detailed Guide for TasksQueue

## Overview

`TasksQueue` is designed to manage tasks with concurrency control, detailed event handling, and flexible execution options. It supports both synchronous and asynchronous execution, along with retry mechanisms for handling task failures.

## Features

- Concurrency control with adjustable limits.
- Event-driven architecture with custom event emitters.
- Supports both synchronous and asynchronous task execution.
- Retries for failed tasks with configurable retry counts.
- Extensive event handling: task added, started, completed, failed, retried, and more.
## Installation

Install `TasksQueue` using npm:

```
npm install your-package-name
```
Or using yarn:
```
yarn add your-package-name
```
## Usage
### Basic Setup
Here's how you can set up a task queue and add tasks:
```typescript
import { TasksQueue, TaskConfig } from 'your-package-name';
const queue = new TasksQueue();
// Define a task function
function exampleTask() {
  console.log("Task is running");
}
// Add a task to the queue
queue.addTask(exampleTask, "task1", { sync: true });
// Start the task execution
queue.run();
```

## Events and Their Payloads

### 1. **taskAdded**

- **Payload**: Includes `id`, `config`, and whether the task was added with `priority`.
- **EventMetadata**: Information like `activeTasks` and `queueLength`.
- **Use Case**: Emitted when a task is added to the queue, useful for logging and monitoring queue size.

### 2. **taskRemoved**

- **Payload**: Minimal, usually just an acknowledgment that a task was removed.
- **EventMetadata**: Includes `activeTasks` and `queueLength`.
- **Use Case**: Useful for cleanup and monitoring after a task is removed from the queue.

### 3. **taskStarted**

- **Payload**: Contains `id` and `config`.
- **EventMetadata**: Includes data about the queue state when the task starts.
- **Use Case**: Indicates the start of a task, important for logging and performance monitoring.

### 4. **taskCompleted**

- **Payload**: Includes `id` and `config`.
- **EventMetadata**: Information about the state of the queue and task performance.
- **Use Case**: Triggered when a task completes successfully, used for logging success and further actions.

### 5. **taskFailed**

- **Payload**: Includes `id`, `config`, and `error` information.
- **EventMetadata**: Includes state data such as `activeTasks`.
- **Use Case**: Emitted on task failure, crucial for error logging and triggering retries if configured.

### 6. **taskRetrying**

- **Payload**: Contains `id`, `config`, retry `count`, and `error`.
- **EventMetadata**: Details like queue state.
- **Use Case**: Triggered when a task is retried, provides a mechanism to handle retries programmatically.

### 7. **queueEmpty**

- **Payload**: Typically none.
- **EventMetadata**: Might include the current state of the queue.
- **Use Case**: Indicates that the queue is empty, useful for triggering new batch loads or scaling down resources.

### 8. **queueFull**

- **Payload**: Usually none.
- **EventMetadata**: Information like `activeTasks` and maximum capacity.
- **Use Case**: Useful for controlling task submission and managing backpressure.

## Configuration Options

### Synchronous vs Asynchronous Execution

- **Sync (`sync: true`)**: Task executes immediately on the main thread. Suitable for quick, lightweight tasks.
- **Async (`sync: false`)**: Task executes asynchronously, allowing for non-blocking operations.

### Execution Context

- **Microtasks (`executeIn: 'microTasks'`)**: Executes the task in the microtask queue, which is used for operations like promise resolution.
- **Callback (`executeIn: 'callback'`)**: Uses `setTimeout`, making it suitable for tasks that need to happen after the current event loop but without a specific delay, unless provided with a `timeout`.

### Retry Mechanism

- **Enabled by setting `retryOnFail: true`**: Automatically retries the task. Must specify `retryCount` to limit retries.
- **Custom callbacks**: `onError` for handling errors, `onRetry` for retry logic, and `finally` for cleanup.

## Methods

### on and off

- Used to attach or detach event listeners.

### addTask

- Adds tasks to the queue with options for priority and specific configurations.

### run

- Starts the task execution process, respecting concurrency limits and handling task lifecycle events.

## Example Usage

```typescript
const queue = new TasksQueue(3); // Limit to 3 concurrent tasks
queue.addTask(someTask, '123', { sync: false, executeIn: 'microTasks' }, false);
queue.on('taskCompleted', (data) => console.log(`Completed: ${data.id}`));
```

## Conclusion

`TasksQueue` offers robust task management with detailed observability and control, making it ideal for applications requiring sophisticated task scheduling and execution management. -->

# Detailed Guide for TasksQueue
## Overview
`TasksQueue` is designed to manage tasks with concurrency control, detailed event handling, and flexible execution options. It supports both synchronous and asynchronous execution, along with retry mechanisms for handling task failures.
## Features
- Concurrency control with adjustable limits.
- Event-driven architecture with custom event emitters.
- Supports both synchronous and asynchronous task execution.
- Retries for failed tasks with configurable retry counts.
- Extensive event handling: task added, started, completed, failed, retried, and more.
## Installation
Install `TasksQueue` using npm:
```
npm install your-package-name
```
Or using yarn:
```
yarn add your-package-name
```
## Usage
### Basic Setup
Here's how you can set up a task queue and add tasks:
```typescript
import { TasksQueue, TaskConfig } from 'your-package-name';
const queue = new TasksQueue();
// Define a task function
function exampleTask() {
  console.log("Task is running");
}
// Add a task to the queue
queue.addTask(exampleTask, "task1", { sync: true });
// Start the task execution
queue.run();
```
## Events and Their Payloads
Each event in the `TasksQueue` provides critical insights into the lifecycle of tasks within the queue:
### 1. **taskAdded**
- **Payload**: Includes `id`, `config`, and whether the task was added with `priority`.
- **EventMetadata**: Information like `activeTasks` and `queueLength`.
- **Use Case**: Triggered when a task is added, useful for monitoring and reacting to changes in the queue's size.
### 2. **taskRemoved**
- **Payload**: Typically minimal, acknowledges a task was removed.
- **EventMetadata**: Includes `activeTasks` and `queueLength`.
- **Use Case**: Ideal for cleanup and tracking the current load on the queue after task removal.
### 3. **taskStarted**
- **Payload**: Contains `id` and `config`.
- **EventMetadata**: Provides data about the queue state at task start.
- **Use Case**: Marks the beginning of task execution, crucial for tracking task progress and system load.
### 4. **taskCompleted**
- **Payload**: Includes `id` and `config`.
- **EventMetadata**: Details on queue state and task performance upon completion.
- **Use Case**: Indicates successful task completion, important for logging and downstream processing.
### 5. **taskFailed**
- **Payload**: Includes `id`, `config`, and the error encountered.
- **EventMetadata**: Captures details like `activeTasks` at the time of failure.
- **Use Case**: Critical for error handling, allows for logging, alerting, and conditional retries based on configuration.
### 6. **taskRetrying**
- **Payload**: Contains `id`, `config`, retry `count`, and the error that triggered the retry.
- **EventMetadata**: Provides queue state and retry details.
- **Use Case**: Activated on task retry, enables adaptive error recovery strategies within the task processing logic.
### 7. **queueEmpty**
- **Payload**: Typically none.
- **EventMetadata**: May include the queue's state when it becomes empty.
- **Use Case**: Useful for triggering new task loads or scaling operations based on queue capacity.
### 8. **queueFull**
- **Payload**: Usually none.
- **EventMetadata**: Details on `activeTasks` and queue capacity constraints.
- **Use Case**: Helps manage task submission rates and informs backpressure strategies.
## Configuration Options and Task Execution
### TaskConfig Structure
```typescript
interface TaskConfig {
  sync?: boolean;              // Determines if the task should run synchronously
  executeIn?: 'microTasks' | 'callback';  // Required if sync is false
  timeout?: number;            // Required if executeIn is 'callback'
  retryOnFail?: boolean;       // Enables retry mechanism
  retryCount?: number;         // Required if retryOnFail is true
  onSuccess?: (result: any) => void;  // Callback on successful task completion
  onError?: (error: Error) => void;   // Callback on task failure
  onRetry?: (error: Error, count: number) => void;  // Callback on retry attempt
finally?: () => void;        // Callback after task completion or failureregardless of success or error
}
```
### Explanation of Configuration
- **Sync vs. Async Execution**:
  - **Sync (`sync: true`)**: The task executes immediately on the main thread. Suitable for quick, lightweight tasks that need immediate processing.
  - **Async (`sync: false`)**: The task executes asynchronously, allowing the main thread to continue processing other tasks. This setting requires specifying `executeIn` to manage how the task is deferred.
- **Execution Context**:
  - **Microtasks (`executeIn: 'microTasks'`)**: Task execution is queued behind any currently running script or any pending promises, making it suitable for tasks that should execute as soon as the current stack clears but before the next event loop cycle.
  - **Callback (`executeIn: 'callback'`)**: Uses `setTimeout`, making it suitable for tasks that need a forced delay or should be scheduled after the current event loop cycle, possibly to allow other operations to complete. The `timeout` parameter specifies the delay.
- **Retry Mechanism**:
  - **Enabled by setting `retryOnFail: true`**: If a task fails, it will automatically retry the number of times specified by `retryCount`.
  - **`retryCount`**: Specifies how many times to retry a failed task before giving up.
- **Callbacks**:
  - **`onSuccess(result: any)`**: Called if the task completes successfully. Useful for handling results immediately after task completion.
  - **`onError(error: Error)`**: Called if the task encounters an error. This is crucial for error handling strategies within tasks.
  - **`onRetry(error: Error, count: number)`**: Called before a retry is attempted, allowing for adjustments or additional logging before the next attempt.
  - **`finally()`**: Always called after task completion, regardless of success or failure, ideal for cleanup activities.
## Example Usage for Each Configuration

### Basic Task Without Specific Configuration
This example shows how to add a task with default settings, which will run synchronously without any special configuration:

```typescript
queue.addTask(() => {
  console.log("Running a basic task with default settings.");
}, "defaultTask");
```

In this setup, because no specific configuration is provided, the task uses the following default configuration:

```typescript
{
  sync: true,
  context: null,
  args: [],
  execute: true,
  retryOnFail: false
}
```

### Synchronous Task Execution
Here is how to configure a task to run synchronously, which is the default behavior if `sync` is not explicitly set to `false`:

```typescript
queue.addTask(() => {
  console.log("This task runs synchronously.");
}, "syncTask", {
  sync: true  // Explicitly setting sync to true
});
```

### Asynchronous Task Execution with Microtasks
For tasks that should run asynchronously soon after the current call stack clears, use the `microTasks` execution context:

```typescript
queue.addTask(async () => {
  console.log("This task runs asynchronously using microtasks.");
}, "asyncMicroTask", {
  sync: false,
  executeIn: 'microTasks'
});
```

This configuration ensures that the task is queued behind any pending promises or microtasks, which is typically quicker than using a callback with a timeout.

### Asynchronous Task Execution with Callback
To delay task execution, use the `callback` execution context with a timeout. This is ideal for deferring task execution without blocking other operations:

```typescript
queue.addTask(async () => {
  console.log("This task runs asynchronously after a delay using callback.");
}, "asyncCallbackTask", {
  sync: false,
  executeIn: 'callback',
  timeout: 2000  // Delay the task execution by 2000 milliseconds
});
```

### Task with Retry Logic
When a task might fail and needs to be retried, configure `retryOnFail` and `retryCount`:

```typescript
queue.addTask(async () => {
  // Simulated task logic that might fail
  if (Math.random() > 0.5) {
    throw new Error("Simulated task error");
  }
  return "Task completed successfully";
}, "taskWithRetry", {
  sync: false,
  executeIn: 'callback',
  timeout: 1000,
  retryOnFail: true,
  retryCount: 3,
  onSuccess: (result) => console.log(`Success: ${result}`),
  onError: (error) => console.log(`Error encountered: ${error.message}`),
  onRetry: (error, count) => console.log(`Retrying task, attempts left: ${count}`),
  finally: () => console.log("Task finalization code runs here.")
});
```

In this setup, if the task fails, it will automatically retry up to three times. Each retry logs the attempt and reduces the retry count until it reaches zero, at which point no further retries will be attempted.


## Purpose of the `context` Field

The `context` field in the `TaskConfig` allows you to specify the `this` context that will be bound to the task function when it is called. In JavaScript and TypeScript, the execution context of a function can significantly affect its behavior, especially when interacting with object properties or methods.

### Use Cases for `context`

 - #### Object Method Execution
    If your task function is a method of an object, you might want to ensure that it executes in the context of that object to have access to other properties or methods of the object.

 - #### Class Instance Methods
    Similarly, if your function is a method of a class instance, setting the `context` to that instance ensures that the method can access other instance methods and properties correctly.

 - ### Maintaining Consistency in Callbacks
    When using functions that rely on external libraries or callbacks, you might need to ensure that the function executes with a specific `this` value to maintain consistency.

#### Example: Using `context` with Object Methods

Here’s how you can use the `context` field when adding a task that is a method of an object:

```typescript
class TaskHandler {
    constructor(public name: string) {}

    doWork() {
        console.log(`Task executed for: ${this.name}`);
    }
}

const myTaskHandler = new TaskHandler("ExampleTask");

queue.addTask(myTaskHandler.doWork, "task1", {
    sync: true,
    context: myTaskHandler  // Ensures 'this' inside doWork refers to myTaskHandler
});

```
In this example, without specifying `context: myTaskHandler`, the `doWork` method would lose its binding to the `myTaskHandler` instance, leading to an undefined reference when accessing `this.name`.

### Considerations and Best Practices

 - #### Avoid Unnecessary Context
If your task function does not use `this` or is already bound (e.g., arrow functions or functions bound with `.bind()`), specifying a `context` is unnecessary.

 - #### Security and Performance
Be mindful of the object you pass as `context`. Passing large objects or objects with complex prototypes can have performance implications and, in rare cases, security implications if the object contains sensitive data.

 - #### Testing and Maintenance
    Functions that rely on a specific context can be more difficult to test and maintain. Consider designing functions to be as independent as possible, or use modern JavaScript features like arrow functions that do not have their own `this` context.

### Handling Events for All Configurations

To effectively monitor and react to various task events regardless of the task configuration:

```typescript
// Event listener for when any task is completed
queue.on('taskCompleted', ({ id, config }) => {
  console.log(`Task ${id} completed with configuration:`, config);
});

// Event listener for when any task fails
queue.on('taskFailed', ({ id, config, error }) => {
  console.log(`Task ${id} failed with error: ${error.message}`);
});
```

These examples demonstrate how to utilize all possible configurations for tasks in `TasksQueue`, providing flexibility and robust error handling for complex applications.

### Monitoring Events

Use the `on` method to attach event listeners that will respond to various task-related events. Below are examples for each type of event, including how to handle the accompanying `EventMetadata`:

```typescript
// When a task is successfully added to the queue
queue.on('taskAdded', ({ id, config, priority }, metadata) => {
  console.log(`Task ${id} added with priority: ${priority} and config:`, config);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});

// When a task is removed from the queue
queue.on('taskRemoved', ({ id }, metadata) => {
  console.log(`Task ${id} removed from the queue`);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});

// When a task starts execution
queue.on('taskStarted', ({ id, config }, metadata) => {
  console.log(`Task ${id} started with config:`, config);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});

// When a task completes successfully
queue.on('taskCompleted', ({ id, config }, metadata) => {
  console.log(`Task ${id} completed with configuration:`, config);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});

// When a task fails
queue.on('taskFailed', ({ id, config, error }, metadata) => {
  console.log(`Task ${id} failed with error: ${error.message}`);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});

// When a task is retried
queue.on('taskRetrying', ({ id, config, count, error }, metadata) => {
  console.log(`Retrying task ${id}, ${count} retries left. Error: ${error.message}`);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});

// When the queue becomes empty
queue.on('queueEmpty', (_, metadata) => {
  console.log("The task queue is now empty.");
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});

// When the queue is full
queue.on('queueFull', (_, metadata) => {
  console.log("The task queue is full and cannot accept new tasks.");
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
});
```

These event handlers are crucial for effective monitoring and response to changes in the task queue's state. Each handler provides detailed information that can be used for logging, user feedback, or conditional logic in your application.

### Detaching Event Listeners

Just as you can attach event listeners with the `on` method, you can remove them using the `off` method. This is particularly useful when you need to clean up event listeners to prevent memory leaks or stop processing events under certain conditions. Below are examples of how to detach event listeners for each type of event:

```typescript
// Detach a listener for task addition
const taskAddedListener = ({ id, config, priority }, metadata) => {
  console.log(`Task ${id} added with priority: ${priority} and config:`, config);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
};
queue.on('taskAdded', taskAddedListener);
// Later, when you no longer need to listen to this event
queue.off('taskAdded', taskAddedListener);

// Detach a listener for task completion
const taskCompletedListener = ({ id, config }, metadata) => {
  console.log(`Task ${id} completed with configuration:`, config);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
};
queue.on('taskCompleted', taskCompletedListener);
// When no longer needed
queue.off('taskCompleted', taskCompletedListener);

// Detach a listener for task failure
const taskFailedListener = ({ id, config, error }, metadata) => {
  console.log(`Task ${id} failed with error: ${error.message}`);
  console.log(`Current queue length: ${metadata.queueLength}, Active tasks: ${metadata.activeTasks}`);
};
queue.on('taskFailed', taskFailedListener);
// To remove the listener
queue.off('taskFailed', taskFailedListener);
```

Using the `off` method helps you manage your event-driven architecture more dynamically, allowing you to add or remove event handling logic as your application's state or requirements change.


## Conclusion
`TasksQueue` offers robust task management capabilities, providing detailed observability and control over task execution. It is ideal for applications that require advanced task scheduling, execution management, and error handling.
## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.