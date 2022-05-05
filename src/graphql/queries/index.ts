import { gql, GraphQLClient } from '@/graphql';
import type { Photo, PhotoSearchFilter } from '@/types';

import PhotoDiscoverSearchFragment from './fragments/PhotoDiscoverSearchFragment.gql?raw';

const graphQLClient = new GraphQLClient('https://api.500px.com/graphql');

export function queryPhotos({
  feature,
  filters,
  sort = 'POPULAR_PULSE',
  count = 20,
  cursor,
}: {
  feature: string;
  filters: PhotoSearchFilter[];
  sort?: string;
  count?: number;
  cursor?: string;
}): Promise<{ photos: Photo[]; endCursor?: string; hasNextPage: boolean }> {
  return graphQLClient
    .query<
      {
        cursor?: string;
        count: number;
        filters: PhotoSearchFilter[];
        sort: string;
      },
      {
        photos: {
          edges: { node: Photo }[];
          pageInfo: { hasNextPage: boolean; endCursor: string };
        };
      }
    >(
      'Photos',
      gql`
        query Photos(
          $cursor: String
          $count: Int
          $filters: [PhotoDiscoverSearchFilter!]
          $sort: PhotoDiscoverSort
        ) {
          ...PhotoDiscoverSearchFragment
        }

        ${PhotoDiscoverSearchFragment}
      `,
      {
        cursor,
        count,
        filters: [{ key: 'FEATURE_NAME', value: feature }, ...filters],
        sort,
      }
    )
    .then((data) => ({
      photos: data.photos.edges.map((edge) => edge.node),
      endCursor: data.photos.pageInfo.endCursor,
      hasNextPage: data.photos.pageInfo.hasNextPage,
    }));
}
