import {
  render, screen, cleanup, fireEvent,
} from '@testing-library/react';
import { ArticlePage } from './article-page';
import { ArticleStatus } from '../../molecules/article-status/article-status';
import {
  metaData, peerReview, status, citation,
} from '../../../utils/mocks';
import { ArticleFiguresTab, ArticleFullTextTab, ArticleReviewsTab } from './tabs';
import { contentToText } from '../../../utils/content-to-text';

describe('ArticlePage', () => {
  it('renders correctly', () => {
    expect(() => render(<ArticlePage msidWithVersion="12345v1" metaData={metaData} status={status} activeTab="fulltext" tabs={[]}>
      <ArticleFullTextTab headings={[]} content={''} peerReview={peerReview} metaData={metaData} />
    </ArticlePage>)).not.toThrow();
  });

  it('renders with figures tab', () => {
    expect(() => render(<ArticlePage msidWithVersion="12345v1" metaData={metaData} status={status} activeTab="figures" tabs={[]}>
      <ArticleFiguresTab content={''} />
    </ArticlePage>)).not.toThrow();
  });

  it('renders with reviews tab', () => {
    expect(() => render(<ArticlePage msidWithVersion="12345v1" metaData={metaData} status={status} activeTab="reviews" tabs={[]}>
      <ArticleReviewsTab peerReview={peerReview} />
    </ArticlePage>)).not.toThrow();
  });

  it('renders with tabs with correct active label', () => {
    const tabs = [
      {
        id: 'fulltext',
        linkElement: <a href={'/reviewed-preprints/12345v1#tab-content'}>Full text</a>,
      },
      {
        id: 'figures',
        linkElement: <a href={'/reviewed-preprints/12345v1/figures#tab-content'}>Figures</a>,
      },
      {
        id: 'reviews',
        linkElement: <a href={'/reviewed-preprints/12345v1/reviews#tab-content'}>Peer review</a>,
      },
    ];
    render(<ArticlePage msidWithVersion="12345v1" metaData={metaData} status={status} activeTab="fulltext" tabs={tabs}>
      <ArticleFullTextTab headings={[]} content={''} peerReview={peerReview} metaData={metaData} />
    </ArticlePage>);

    expect(screen.getByText('Full text')).toBeInTheDocument();
    expect(screen.getByText('Figures')).toBeInTheDocument();
    expect(screen.getByText('Peer review')).toBeInTheDocument();

    expect(screen.getByText('Full text').parentElement?.classList.value).toContain('tab-label--active');
    expect(screen.getByText('Figures').parentElement?.classList.value).not.toContain('tab-label--active');
    expect(screen.getByText('Peer review').parentElement?.classList.value).not.toContain('tab-label--active');

    cleanup();
    render(<ArticlePage msidWithVersion="12345v1" metaData={metaData} status={status} activeTab="figures" tabs={tabs}>
      <ArticleFullTextTab headings={[]} content={''} peerReview={peerReview} metaData={metaData} />
    </ArticlePage>);

    expect(screen.getByText('Full text').parentElement?.classList.value).not.toContain('tab-label--active');
    expect(screen.getByText('Figures').parentElement?.classList.value).toContain('tab-label--active');
    expect(screen.getByText('Peer review').parentElement?.classList.value).not.toContain('tab-label--active');

    cleanup();
    render(<ArticlePage msidWithVersion="12345v1" metaData={metaData} status={status} activeTab="reviews" tabs={tabs}>
      <ArticleFullTextTab headings={[]} content={''} peerReview={peerReview} metaData={metaData} />
    </ArticlePage>);

    expect(screen.getByText('Full text').parentElement?.classList.value).not.toContain('tab-label--active');
    expect(screen.getByText('Figures').parentElement?.classList.value).not.toContain('tab-label--active');
    expect(screen.getByText('Peer review').parentElement?.classList.value).toContain('tab-label--active');
  });

  it('passes correct doi to status component', () => {
    const expectedDoi = '10.7554/eLife.123456.1';
    const encodedExpectedDoi = encodeURIComponent(expectedDoi);
    const { container } = render(
      <ArticleStatus articleStatus={status.status} doi={expectedDoi} articleType={status.articleType} pdfUrl={metaData.pdfUrl} title={contentToText(metaData.title)} citation={citation} msid="12345"/>,
    );

    fireEvent.click(screen.getByText('Share'));

    expect(screen.getByDisplayValue(expectedDoi, { exact: false })).toBeInTheDocument();

    Array.from(container.getElementsByClassName('socials-sharer'))
      .map((el) => el.getAttribute('href'))
      .forEach((url) => expect(url).toStrictEqual(expect.stringContaining(encodedExpectedDoi)));
  });
});
