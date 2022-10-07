import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  ArticlePage,
  ArticlePageProps,
  ArticleStatusProps,
  PeerReviewProps,
} from '../../components/pages/article/article-page';
import { config } from '../../config';
import { manuscripts } from '../../manuscripts';
import { Content } from '../../types/content';

export const Page = (props: { metaData: ArticlePageProps, abstract: Content, content: Content, status: ArticleStatusProps, peerReview: PeerReviewProps }): JSX.Element => (
  <ArticlePage {...props}></ArticlePage>
);

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const msid = context.params?.msid;
  if (msid === undefined) {
    console.log('no msid in path'); // eslint-disable-line no-console
    return { props: {} };
  }

  if (Array.isArray(msid)) {
    console.log('multiple ids in path'); // eslint-disable-line no-console
    return { props: {} };
  }

  if (!manuscripts[msid]) {
    console.log('Cannot find msid configured'); // eslint-disable-line no-console
    return { props: {} };
  }

  const manuscriptConfig = manuscripts[msid];

  // map msid to preprint doi
  const { preprintDoi } = manuscriptConfig;

  const [article, metaData, content, peerReview, status] = await Promise.all([
    await fetch(`${config.apiServer}/api/reviewed-preprints/${preprintDoi}`).then((res) => res.json()),
    await fetch(`${config.apiServer}/api/reviewed-preprints/${preprintDoi}/metadata`).then((res) => res.json()),
    await fetch(`${config.apiServer}/api/reviewed-preprints/${preprintDoi}/content`).then((res) => res.json()),
    await fetch(`${config.apiServer}/api/reviewed-preprints/${preprintDoi}/reviews`).then((res) => res.json()),
    // replace with call for data
    manuscripts[msid].status,
  ]);

  return {
    props: {
      metaData: {
        ...metaData,
        msid,
        version: manuscriptConfig.version,
      },
      abstract: metaData.abstract,
      content,
      status,
      peerReview,
      references: article.references,
    },
  };
};

export default Page;
