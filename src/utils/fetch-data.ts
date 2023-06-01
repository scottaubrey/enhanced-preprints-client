import { readFileSync } from 'fs';
import { config } from '../config';
import { jsonFetch } from './json-fetch';
import { Content } from '../types/content';
import { EnhancedArticle, MetaData, PeerReview } from '../types';

type ReviewsJson = {
  [index: string]: PeerReview;
};

const reviewsJson = JSON.parse(readFileSync(config.reviewsConfigFile).toString()) as ReviewsJson;

export const fetchMetadata = (id: string) => jsonFetch<MetaData>(`${config.apiServer}/api/reviewed-preprints/${id}/metadata`);
export const fetchContent = (id: string) => jsonFetch<Content>(`${config.apiServer}/api/reviewed-preprints/${id}/content`);
export const fetchReviews = (id: string, version: string) => {
  if (reviewsJson[`${id}/v${version}`]) {
    return reviewsJson[`${id}/v${version}`];
  }
  return jsonFetch<PeerReview>(`${config.apiServer}/api/reviewed-preprints/${id}/reviews`);
};

export type EnhancedArticleWithVersions = {
  article: EnhancedArticle,
  versions: Record<string, EnhancedArticle>,
};

export const fetchVersion = (id: string) => jsonFetch<EnhancedArticleWithVersions>(`${config.apiServer}/api/preprints/${id}`);
