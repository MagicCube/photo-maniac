export interface Message<P = undefined> {
  type: 'photomaniac.commands.nextPhoto' | 'photomaniac.commands.updatePhotos';
  payload: P;
}
