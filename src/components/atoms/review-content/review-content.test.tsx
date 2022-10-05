import { render, screen } from '@testing-library/react';
import { ReviewContent } from './review-content';

describe('ArticleContent', () => {
  it('renders with a simple string content', async () => {
    render(<ReviewContent content="I am an article"/>);

    expect(screen.getByText('I am an article')).toBeInTheDocument();
  });

  it('renders with a complex html', async () => {
    render(<ReviewContent content={`<h1>Markdown title</h1>

<em>I am an em<em>`}/>);

    expect(screen.getByText('Markdown title')).toBeInTheDocument();
    expect(screen.getByText('Markdown title').tagName).toStrictEqual('H1');

    expect(screen.getByText('I am an em')).toBeInTheDocument();
    expect(screen.getByText('I am an em').tagName).toStrictEqual('EM');
  });
});
