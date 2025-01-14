import { StoryFn, Meta } from '@storybook/react';
import { ReviewContent } from './review-content';

export default {
  title: 'Atoms/Review Content',
  component: ReviewContent,
} as Meta<typeof ReviewContent>;

const Template: StoryFn<typeof ReviewContent> = (args) => (
  <ReviewContent {...args} />
);

export const ReviewDoi = Template.bind({});
ReviewDoi.args = {
  content: `# This is a review in markdown

  With some body *emphasised*`,
  doi: '10.7554/eLife.81090.sa0',
};

export const ReviewAssessmentAndDoi = Template.bind({});
ReviewAssessmentAndDoi.args = {
  content: `# This is a review in markdown

  With some body *emphasised*`,
  isAssessment: true,
  peerReviewUrl: '#',
  doi: '10.7554/eLife.81090.sa0',
};

export const ReviewBlockQuote = Template.bind({});
ReviewBlockQuote.args = {
  content: `# This is a review in markdown

> With some body *emphasised*

Some other comments here reference the quote above`,
};
