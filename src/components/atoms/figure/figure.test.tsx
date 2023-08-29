import { render, screen } from '@testing-library/react';
import { Figure } from './figure';
import { FigureContent } from '../../../types';

const content: FigureContent = {
  caption: 'this is a figure',
  content: 'some content',
  id: 'id',
  label: 'I am a label',
  type: 'Figure',
};

describe('Figure', () => {
  it('renders correctly', () => {
    const { container } = render(<Figure content={content}/>);

    expect(screen.getByText('some content')).toBeInTheDocument();
    expect(container.querySelector('#id')).toBeInTheDocument();
  });

  it('renders the content', () => {
    const complexContent: FigureContent = {
      ...content,
      content: {
        type: 'Strong',
        content: 'Bold Text',
      },
    };

    render(<Figure content={complexContent}/>);

    expect(screen.getByText('Bold Text').tagName).toBe('STRONG');
  });

  it('renders the label', () => {
    render(<Figure content={content}/>);

    expect(screen.getByText('I am a label')).toBeInTheDocument();
  });

  it('renders the caption', () => {
    render(<Figure content={content}/>);

    expect(screen.getByText('this is a figure')).toBeInTheDocument();
  });

  it('renders a complex caption', () => {
    const complexContent: FigureContent = {
      ...content,
      caption: [
        {
          type: 'Heading',
          content: 'Heading 1',
          depth: 4,
          id: 'h4',
        },
        {
          type: 'Emphasis',
          content: 'Italic Text',
        },
        {
          type: 'Heading',
          content: 'Heading 4',
          depth: 4,
          id: 'h4',
        },
      ],
    };

    render(<Figure content={complexContent}/>);

    expect(screen.getByText('Heading 1').tagName).toBe('H4');
    expect(screen.getByText('Italic Text').tagName).toBe('EM');
    expect(screen.getByText('Heading 4').tagName).toBe('H4');
  });

  it('should not render caption if not defined', () => {
    const noCaption: FigureContent = {
      ...content,
      caption: undefined,
    };

    const { container } = render(<Figure content={noCaption}/>);

    expect(container.querySelector('figcaption')).not.toBeInTheDocument();
  });

  it('should not render label if not defined', () => {
    const noLabel: FigureContent = {
      ...content,
      label: undefined,
    };

    const { container } = render(<Figure content={noLabel}/>);

    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('should not set id if not defined', () => {
    const noId: FigureContent = {
      ...content,
      id: undefined,
    };

    const { container } = render(<Figure content={noId}/>);

    expect(container.querySelector('#id')).not.toBeInTheDocument();
  });

  describe('caption', () => {
    it.todo('hides extra caption on the first render');
    it.todo('has a show more button for long captions');
    it.todo('has a show less button for expanded long captions');
    it.todo('does not display the show more button for short captions');
    it.todo('expands the caption when show more button clicked');
    it.todo('collapses the caption when show less button clicked');

    it('has a show more button for long captions', () => {
      const longCaption = `
        Line 1
        Line 2
        Line 3
        Line 4
        Line 5
        Line 6
      `;

      const testContentWithLongCaption = {
        ...content,
        caption: longCaption,
      };

      render(<Figure content={testContentWithLongCaption} />);

      const showMoreButton = screen.queryByText('Show more');
      expect(showMoreButton).not.toBeNull();
    });

    it('does not display the show more button for short captions', () => {
      const shortCaption = 'Short Caption';
      const testContentWithShortCaption = {
        ...content,
        caption: shortCaption,
      };

      render(<Figure content={testContentWithShortCaption} />);

      const showMoreButton = screen.queryByText('Show less');
      expect(showMoreButton).toBeNull();
    });
  });
});
