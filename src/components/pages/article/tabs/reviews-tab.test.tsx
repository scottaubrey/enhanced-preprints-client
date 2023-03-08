import { render, screen } from '@testing-library/react';
import { ArticleReviewsTab } from './reviews-tab';
import { peerReview } from '../../../../utils/mocks';
import { PeerReview } from '../../../../types';

describe('ReviewsTab', () => {
  // This could be useful for other tabs.
  type ExpectedJumpLinksType = {
    description: string,
    peerReviewExample: PeerReview,
    expectedJumpToLinks: {
      href: string,
      text: string,
    }[],
  };

  it('renders with reviews tab', () => {
    expect(() => render(<ArticleReviewsTab peerReview={peerReview} />)).not.toThrow();
  });

  it('renders each review in the peer review passed in', () => {
    render(<ArticleReviewsTab peerReview={peerReview} />);

    expect(screen.getByText(peerReview.reviews[0].text)).toBeInTheDocument();
    expect(screen.getByText(peerReview.reviews[1].text)).toBeInTheDocument();
  });

  it('renders the author response when it is in the peer review', () => {
    render(<ArticleReviewsTab peerReview={peerReview} />);

    expect(screen.getByText(peerReview.authorResponse!.text)).toBeInTheDocument();
  });

  it.each([
    {
      description: 'complete',
      peerReviewExample: peerReview,
      expectedJumpToLinks: [
        {
          href: '#editors-and-reviewers',
          text: 'Editors',
        },
        {
          href: '#peer-review-0',
          text: 'Reviewer #1',
        },
        {
          href: '#peer-review-1',
          text: 'Reviewer #2',
        },
        {
          href: '#author-response',
          text: 'Author Response',
        },
      ],
    },
    {
      description: 'without authorResponse',
      peerReviewExample: {
        evaluationSummary: peerReview.evaluationSummary,
        reviews: peerReview.reviews,
      },
      expectedJumpToLinks: [
        {
          href: '#editors-and-reviewers',
          text: 'Editors',
        },
        {
          href: '#peer-review-0',
          text: 'Reviewer #1',
        },
        {
          href: '#peer-review-1',
          text: 'Reviewer #2',
        },
      ],
    },
    {
      description: 'without reviews',
      peerReviewExample: {
        evaluationSummary: peerReview.evaluationSummary,
        reviews: [],
      },
      expectedJumpToLinks: [
        {
          href: '#editors-and-reviewers',
          text: 'Editors',
        },
      ],
    },
  ])('passes down the correct headings to jump-to-menu ($description)', ({
    peerReviewExample,
    expectedJumpToLinks,
  }: ExpectedJumpLinksType) => {
    const { container } = render(<ArticleReviewsTab peerReview={peerReviewExample} />);
    const jumpLinks = container.querySelectorAll('.jump-menu-list__link');

    expect(jumpLinks).toHaveLength(expectedJumpToLinks.length);

    const jumpLinkValues = Array.from(jumpLinks).map((link: Element) => (
      {
        href: link.getAttribute('href')!,
        text: link.textContent!,
      }
    ));

    expect(jumpLinkValues).toStrictEqual(expectedJumpToLinks);
  });

  it('uses the heading ids for the hrefs in jump-to-menu', () => {
    const { container } = render(<ArticleReviewsTab peerReview={peerReview} />);

    const headings = Array.from(container.querySelectorAll('section[id], h2[id]'));
    const ids = headings.map(({ id }) => id);

    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('.jump-menu-list__link'));
    const hrefs = links.map(({ href }) => href.slice(href.indexOf('#') + 1));

    expect(ids).toStrictEqual(expect.arrayContaining(hrefs));
  });
});
