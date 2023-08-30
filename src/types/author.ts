import { Institution } from './institution';

export type Author = {
  type?: 'Person'
  givenNames?: string[],
  honorificSuffix?: string[],
  familyNames?: string[],
  affiliations?: Institution[],
  identifiers?: {
    type?: string,
    name?: string,
    propertyID?: string,
    value: string,
  }[],
  emails?: string[],
};
