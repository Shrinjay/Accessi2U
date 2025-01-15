export class ApplicationError extends Error {
  constructor(message = 'ApplicationError', status = 500) {
    super();

    if (message) this.message = message;
    if (status) this.status = status;
  }

  public status: number;
}
