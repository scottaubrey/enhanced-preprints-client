import {
  EnhancedArticle, EnhancedArticleWithVersions, VersionSummary, ArticleStatus,
} from '../types';

const isVersionSameAsCurrentArticle = (article: EnhancedArticle, version: VersionSummary) => version.id === article.id && version.versionIdentifier === article.versionIdentifier;

const orderVersionsChronologically = (versions: VersionSummary[]) => versions.sort((a, b) => new Date(a.preprintPosted).getTime() - new Date(b.preprintPosted).getTime());
const getFirstVersion = (version: EnhancedArticleWithVersions) => orderVersionsChronologically(Object.values(version.versions))[0];

export const generateStatus = (version: EnhancedArticleWithVersions): ArticleStatus => ({
  type: 'Reviewed Preprint',
  status: isVersionSameAsCurrentArticle(version.article, getFirstVersion(version)) ? 'Published from the original preprint after peer review and assessment by eLife.' : 'Revised by authors after peer review.',
  isPreview: !version.article.published || new Date(version.article.published) > (new Date()),
});
