export interface Message<P = undefined> {
  type:
    | 'photomaniac.commands.nextPhoto'
    | 'photomaniac.commands.updatePhotos'
    | 'photomaniac.events.photosUpdated';
  payload?: P;
}
