// This is a stub for Firebase lib to prevent crashes when testing
export const db = {} as any;
export const auth = {
  currentUser: null
} as any;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string|null) {
  console.error('Mock Error:', error, operationType, path);
}
