export type MessageType =
  | 'photomaniac.commands.nextPhoto'
  | 'photomaniac.commands.updatePhotos'
  | 'photomaniac.events.photosUpdated';

export interface Message<P = undefined> {
  type: MessageType;
  payload?: P;
}
