import { config } from '../config';
import { jsonFetch, jsonFetchOrNull } from './json-fetch';
import { ArticleSummary, EnhancedArticleWithVersions } from '../types';
import { EnhancedArticleNoContent } from '../types/reviewed-preprint-snippet';

export const fetchVersion = (id: string, preview: boolean = false) => jsonFetchOrNull<EnhancedArticleWithVersions>(`${config.apiServer}/api/preprints/${id}${preview ? '?previews=true' : ''}`);
export const fetchVersions = () => jsonFetch<{ items: ArticleSummary[], total: number }>(`${config.apiServer}/api/preprints`);
export const fetchVersionsNoContent = async (page: number, perPage: number, order: string) => {
  const url = `${config.apiServer}/api/preprints-no-content?page=${page}&per-page=${perPage}&order=${order}`;
  return fetch(url)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`error fetching (${url}): ${response.statusText}`);
      }

      const items = await response.json() as EnhancedArticleNoContent[];

      const total = response.headers.get('x-total-count')
        ? parseInt(response.headers.get('x-total-count') as string, 10)
        : Object.keys(items).length;

      return {
        total,
        items,
      };
    });
};
