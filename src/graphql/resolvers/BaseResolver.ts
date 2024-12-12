export abstract class BaseResolver {
  protected handleError(error: unknown): never {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`GraphQL Error: ${message}`);
    throw new Error(message);
  }

  protected async tryExecute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error);
    }
  }
} 