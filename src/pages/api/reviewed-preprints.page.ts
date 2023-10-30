import type { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../../config';
import { FullManuscriptConfig, getManuscriptsLatest } from '../../manuscripts';
import { fetchMetadata, fetchVersionsNoContent } from '../../utils/fetch-data';
import {
  Author, EnhancedArticle, MetaData, ReviewedPreprintSnippet,
} from '../../types';
import { getSubjects } from '../../components/molecules/article-flag-list/article-flag-list';
import { TimelineEvent } from '../../components/molecules/timeline/timeline';
import { contentToHtml } from '../../utils/content-to-html';
import { EnhancedArticleNoContent } from '../../types/reviewed-preprint-snippet';

type BadRequestMessage = {
  title: 'bad request' | 'not found',
  detail?: string,
};

type ReviewedPreprintItemResponse = {
  indexContent?: string,
} & ReviewedPreprintSnippet;

type ReviewedPreprintListResponse = {
  total: number,
  items: ReviewedPreprintSnippet[],
};

export const prepareAuthor = (author: Author) : string => {
  const givenNames = (author.givenNames ?? []).join(' ');
  const familyNames = (author.familyNames ?? []).join(' ');

  return `${givenNames}${familyNames ? ' ' : ''}${familyNames}`;
};

const prepareAuthorLine = (authors: Author[]) : undefined | string => {
  if (authors.length === 0) {
    return;
  }

  const authorLine = [];

  if (authors.length > 0) {
    authorLine.push(prepareAuthor(authors[0]));
  }

  if (authors.length > 1) {
    authorLine.push(prepareAuthor(authors[1]));
  }

  if (authors.length > 2) {
    authorLine.push(prepareAuthor(authors[authors.length - 1]));
  }

  return [authorLine.slice(0, 2).join(', '), authorLine.length > 2 ? authorLine[2] : null].filter((a) => a !== null).join(authors.length > 3 ? ' ... ' : ', '); // eslint-disable-line consistent-return
};

const reviewedDates = (timeline: TimelineEvent[]) : string[] => timeline.filter((t) => t.name.startsWith('Reviewed preprint ')).sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime())).map((t) => `${t.date}T03:00:00Z`);

export const writeResponse = (res: NextApiResponse, contentType: string, statusCode: 200 | 400 | 404, message: BadRequestMessage | ReviewedPreprintListResponse | ReviewedPreprintItemResponse) : void => {
  res
    .writeHead(statusCode, {
      'Content-Type': contentType,
      'Cache-Control': statusCode === 200 ? 'max-age=300, public, stale-if-error=86400, stale-while-revalidate=300' : 'must-revalidate, no-cache, private',
      Vary: ['Accept', 'Authorization'],
    })
    .end(JSON.stringify(message));
};

const errorBadRequest = (res: NextApiResponse, message: string) : void => {
  writeResponse(res, 'application/problem+json', 400, {
    title: 'bad request',
    detail: message,
  });
};

export const errorNotFoundRequest = (res: NextApiResponse) : void => {
  writeResponse(res, 'application/json', 404, {
    title: 'not found',
  });
};

type Param = string | Number | Array<string | Number> | null;

const queryParam = (req: NextApiRequest, key: string, defaultValue: Param = null) : Param => req.query[key] ?? defaultValue;

export const reviewedPreprintSnippet = (manuscript: FullManuscriptConfig, meta?: MetaData) : ReviewedPreprintSnippet => {
  const dates = reviewedDates(manuscript.status.timeline);
  const reviewedDate = dates[dates.length - 1];
  const versionDate = dates[0];

  return {
    id: manuscript.msid,
    doi: manuscript.preprintDoi,
    pdf: manuscript.pdfUrl,
    status: 'reviewed',
    authorLine: meta ? prepareAuthorLine(meta.authors) : undefined,
    title: meta ? contentToHtml(meta.title) : undefined,
    published: reviewedDate,
    reviewedDate,
    versionDate,
    statusDate: versionDate,
    stage: 'published',
    subjects: getSubjects(manuscript.msas),
  };
};

export const enhancedArticleNoContentToSnippet = ({
  msid,
  preprintDoi,
  pdfUrl,
  article,
  published,
  subjects,
}: EnhancedArticleNoContent): ReviewedPreprintSnippet => ({
  id: msid,
  doi: preprintDoi,
  pdf: pdfUrl,
  status: 'reviewed',
  authorLine: prepareAuthorLine(article.authors || []),
  title: contentToHtml(article.title),
  published: new Date(published!).toISOString(),
  reviewedDate: new Date(published!).toISOString(),
  versionDate: new Date(published!).toISOString(),
  statusDate: new Date(published!).toISOString(),
  stage: 'published',
  subjects: getSubjects(subjects || []),
});

export const enhancedArticleToReviewedPreprintItemResponse = ({
  msid,
  preprintDoi,
  pdfUrl,
  article,
  published,
  subjects,
  article: { content, authors },
}: EnhancedArticle): ReviewedPreprintItemResponse => ({
  id: msid,
  doi: preprintDoi,
  pdf: pdfUrl,
  status: 'reviewed',
  authorLine: prepareAuthorLine(authors || []),
  title: contentToHtml(article.title),
  published: new Date(published!).toISOString(),
  reviewedDate: new Date(published!).toISOString(),
  versionDate: new Date(published!).toISOString(),
  statusDate: new Date(published!).toISOString(),
  stage: 'published',
  subjects: getSubjects(subjects || []),
  indexContent: `${authors?.map((author) => prepareAuthor(author)).join(', ')} ${contentToHtml(content)}`,
});

const serverApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const snippets = await fetchVersionsNoContent();
  const now = new Date();
  const latestVersions = snippets.reduce<Map<string, EnhancedArticleNoContent>>((items, item) => {
    if (!item.published) {
      // only consider published items
      return items;
    }
    const newItemPublishedDate = new Date(item.published);
    if (newItemPublishedDate >= now) {
      // only consider items already published (published date in the past)
      return items;
    }
    const existingItem = items.get(item.msid);
    if (existingItem && existingItem.published) {
      const existingItemPublishedDate = new Date(existingItem.published);
      // Only the latest published item should be in the output map
      if (existingItemPublishedDate < newItemPublishedDate) {
        items.set(item.msid, item);
      }
    } else {
      items.set(item.msid, item);
    }
    return items;
  }, new Map<string, EnhancedArticleNoContent>())
    .values();

  const latestSnippets = Array.from(latestVersions).map(enhancedArticleNoContentToSnippet);

  const [perPage, page] = [
    queryParam(req, 'per-page', 20),
    queryParam(req, 'page', 1),
  ].map((v) => {
    const n = Number(v);

    return n.toString() === parseInt(n.toString(), 10).toString() ? n : -1;
  });

  const order = queryParam(req, 'order', 'desc');

  if (page <= 0) {
    errorBadRequest(res, 'expecting positive integer for \'page\' parameter');
  }

  if (perPage <= 0 || perPage > 100) {
    errorBadRequest(res, 'expecting positive integer between 1 and 100 for \'per-page\' parameter');
  }

  if (typeof order !== 'string' || ['asc', 'desc'].includes(order) === false) {
    errorBadRequest(res, 'expecting either \'asc\' or \'desc\' for \'order\' parameter');
  }

  const offset = (page - 1) * perPage;

  const returnedSnippets = latestSnippets.sort((a, b) => {
    const diff = new Date(a.statusDate ?? '2000-01-01').getTime() - new Date(b.statusDate ?? '2000-01-01').getTime();

    return (order === 'asc' && diff >= 0) || (order !== 'asc' && diff < 0) ? 1 : -1;
  }).slice(offset, offset + perPage);

  writeResponse(res, 'application/vnd.elife.reviewed-preprint-list+json; version=1', 200, {
    total: Object.keys(latestSnippets).length,
    items: returnedSnippets,
  });
};

const manuscriptApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const manuscripts = getManuscriptsLatest(config.manuscriptConfigFile);
  const allItems = Object.values(manuscripts).map((manuscript) => reviewedPreprintSnippet(manuscript));

  const [perPage, page] = [
    queryParam(req, 'per-page', 20),
    queryParam(req, 'page', 1),
  ].map((v) => {
    const n = Number(v);

    return n.toString() === parseInt(n.toString(), 10).toString() ? n : -1;
  });
  const order = queryParam(req, 'order', 'desc');

  if (page <= 0) {
    errorBadRequest(res, 'expecting positive integer for \'page\' parameter');
  }

  if (perPage <= 0 || perPage > 100) {
    errorBadRequest(res, 'expecting positive integer between 1 and 100 for \'per-page\' parameter');
  }

  if (typeof order !== 'string' || ['asc', 'desc'].includes(order) === false) {
    errorBadRequest(res, 'expecting either \'asc\' or \'desc\' for \'order\' parameter');
  }

  const offset = (page - 1) * perPage;

  const items = await Promise
    .all(
      (
        allItems
          .sort((a, b) => {
            const diff = new Date(a.statusDate ?? '2000-01-01').getTime() - new Date(b.statusDate ?? '2000-01-01').getTime();

            return (order === 'asc' && diff >= 0) || (order !== 'asc' && diff < 0) ? 1 : -1;
          })
          .slice(offset, offset + perPage)
      )
        .map(
          async (item) => fetchMetadata(`${manuscripts[item.id].msid}/v${manuscripts[item.id].version}`)
            .then((js) => ({ ...item, title: contentToHtml(js.title), authorLine: prepareAuthorLine(js.authors) })),
        ),
    );

  writeResponse(res, 'application/vnd.elife.reviewed-preprint-list+json; version=1', 200, {
    total: allItems.length,
    items,
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (config.automationFlag) {
    return serverApi(req, res);
  }

  return manuscriptApi(req, res);
};
