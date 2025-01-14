import { GetServerSideProps } from 'next';
import { fetchVersions } from '../utils/fetch-data';
import { ArticleSummary } from '../types/enhanced-article';
import { Heading } from '../components/atoms/heading/heading';

type PageProps = {
  ids?: string[],
  articles?: ArticleSummary[]
  previews?: ArticleSummary[]
};
export const App = ({ ids, articles, previews }: PageProps) => (
  <main className="primary-section">
    <div className="article-body-container">
      <Heading id="articles" headingLevel={2} content="Articles:" />
      <ul>
        {ids && ids
          .map((id, index) => <li key={index}><a href={`/reviewed-preprints/${id}`}>{id}</a></li>)
        }
        {articles && articles
          .map(({ id }, index) => <li key={index}><a href={`/reviewed-preprints/${id}`}>{id}</a></li>)
        }
      </ul>

      {previews && <>
        <Heading id="previews" headingLevel={2} content="Previews:" />
        <ul>
          {previews
            .map(({ id }, index) => <li key={index}><a href={`/previews/${id}`}>{id}</a></li>)
          }
        </ul>
      </>}
    </div>
  </main>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const versions = (await fetchVersions()).items.sort((a, b) => (a.id > b.id ? 1 : -1));
  const articles = versions.filter((version) => (version.date));
  const previews = versions.filter((version) => (!version.date));
  return {
    props: {
      articles,
      previews,
    },
  };
};

export default App;
