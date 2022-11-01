import { render, screen } from '@testing-library/react';
import { Author } from '../../atoms/authors/authors';
import { AuthorList } from './author-list';

const authors: Author[] = [
  {
    givenNames: ['Thor'],
    familyNames: ['Odinson'],
    affiliations: [
      {
        name: 'The Avengers',
        address: { addressCountry: 'New York' },
      },
    ],
  },
  {
    givenNames: ['Loki'],
    familyNames: ['Laufeyson'],
    affiliations: [{
      name: 'The Revengers',
      address: { addressCountry: 'Sakaar' },
    }],
  },
  {
    givenNames: ['Bruce'],
    familyNames: ['Banner'],
    affiliations: [{
      name: 'The Avengers',
      address: { addressCountry: 'New York' },
    }],
  },
  {
    givenNames: ['The', 'Incredible'],
    familyNames: ['Hulk'],
  },
  {
    givenNames: ['Valkyrie'],
    familyNames: ['Brunnhilde'],
    affiliations: [{
      name: 'The Valkyrie',
      address: { addressCountry: 'Asgard' },
    }],
  },
];

describe('AuthorList', () => {
  it('renders correctly', () => {
    render(<AuthorList authors={authors}/>);

    expect(screen.getByText('Author information')).toBeInTheDocument();
  });

  it('renders each author in the list', () => {
    render(<AuthorList authors={authors}/>);

    expect(screen.getByText('Thor Odinson')).toBeInTheDocument();
    expect(screen.getByText('Loki Laufeyson')).toBeInTheDocument();
    expect(screen.getByText('Bruce Banner')).toBeInTheDocument();
    expect(screen.getByText('The Incredible Hulk')).toBeInTheDocument();
    expect(screen.getByText('Valkyrie Brunnhilde')).toBeInTheDocument();
  });

  it('renders the authors affiliations', () => {
    render(<AuthorList authors={authors}/>);

    expect(screen.getByText('Thor Odinson').nextSibling).toHaveTextContent('The Avengers');
    expect(screen.getByText('Loki Laufeyson').nextSibling).toHaveTextContent('The Revengers');
    expect(screen.getByText('Bruce Banner').nextSibling).toHaveTextContent('The Avengers');
    expect(screen.getByText('The Incredible Hulk').nextSibling).not.toBeInTheDocument();
    expect(screen.getByText('Valkyrie Brunnhilde').nextSibling).toHaveTextContent('The Valkyrie');
  });
});