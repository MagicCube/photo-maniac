export interface Message<P = undefined> {
  type: 'photomaniac.commands.nextPhoto';
  payload: P;
}
