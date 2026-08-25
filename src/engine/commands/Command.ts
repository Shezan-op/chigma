export interface Command {
  id?: string;
  description: string;
  execute(): void;
  undo(): void;
}
