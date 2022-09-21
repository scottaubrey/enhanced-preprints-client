import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ArticlePage } from './[...doi].page';
import { mockContent } from '../../components/atoms/article-content/mock-content';

export default {
  title: 'Pages/Article',
  component: ArticlePage,
} as ComponentMeta<typeof ArticlePage>;

const Template: ComponentStory<typeof ArticlePage> = () => {
  const doi = '10.1101/2022.04.13.488149';
  const metaData = {
    doi,
    msas: ['Mad Science', 'Alchemy'],
    importance: 'Landmark',
    strengthOfEvidence: 'Tour-de-force',
    title: 'This is a title',
    authors: [
      { givenNames: ['Steve'], familyNames: ['Rogers'] },
      { givenNames: ['Antony'], familyNames: ['Stark'] },
      { givenNames: ['Natasha'], familyNames: ['Romanov'] },
      { givenNames: ['Bruce'], familyNames: ['Banner'] },
      { givenNames: ['Wanda'], familyNames: ['Maximof'] },
      { givenNames: ['Bucky'], familyNames: ['Barnes'] },
      { givenNames: ['Barry'], familyNames: ['Allen'] },
      { givenNames: ['Jesse'], familyNames: ['Quick'] },
      { givenNames: ['Kara'], familyNames: ['Zor-el'] },
      { givenNames: ['Arthur'], familyNames: ['Curry'] },
      { givenNames: ['Kal'], familyNames: ['El'] },
      { givenNames: ['Oliver'], familyNames: ['Queen'] },
    ],
    headings: [{ id: 's1', text: 'Introduction' }],
    views: 1,
    citations: 2,
    tweets: 3,
  };

  return <ArticlePage metaData={metaData} content={mockContent}/>;
};

export const DefaultArticlePage = Template.bind({});
