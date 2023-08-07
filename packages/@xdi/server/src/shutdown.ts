import { exitAfterCleanup, addCleanupListener, removeCleanupListener } from 'async-cleanup';

export interface Shutdown {
  (status?: number): Promise<never>;
}

export interface ShutdownTask {
  (): void | Promise<void>;
}

export interface AddShutdownTask {
  (task: ShutdownTask): void;
}

export interface RemoveShutdownTask {
  (task: ShutdownTask): boolean;
}

export const shutdown: Shutdown = exitAfterCleanup;
export const addShutdownTask: AddShutdownTask = addCleanupListener;
export const removeShutdownTask: RemoveShutdownTask = removeCleanupListener;
