import { gql, GraphQLClient } from '@/graphql';
import type { Photo, PhotoSearchFilter } from '@/types';

import PhotoDiscoverSearchFragment from './fragments/PhotoDiscoverSearchFragment.gql?raw';

const graphQLClient = new GraphQLClient('https://api.500px.com/graphql');

export function queryPhotos({
  feature,
  filters,
  sort = 'POPULAR_PULSE',
  count = 20,
}: {
  feature: string;
  filters: PhotoSearchFilter[];
  sort?: string;
  count?: number;
}) {
  return graphQLClient
    .query<
      { count: number; filters: PhotoSearchFilter[]; sort: string },
      { photos: { edges: { node: Photo }[] } }
    >(
      'Photos',
      gql`
        query Photos(
          $count: Int
          $filters: [PhotoDiscoverSearchFilter!]
          $sort: PhotoDiscoverSort
        ) {
          ...PhotoDiscoverSearchFragment
        }

        ${PhotoDiscoverSearchFragment}
      `,
      {
        count,
        filters: [{ key: 'FEATURE_NAME', value: feature }, ...filters],
        sort,
      }
    )
    .then((data) => data.photos.edges.map((edge) => edge.node));
}
