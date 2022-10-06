import styles from './review-content.module.scss';

const terms = [
  'landmark', 'fundamental', 'important', 'noteworthy', 'useful', 'flawed', 'tour-de-force', 'compelling', 'convincing', 'solid', 'incomplete', 'inadequate',
];

const highlightTerms = (content: string): string => {
  let highlightedContent = content;
  terms.forEach((term) => {
    highlightedContent = highlightedContent.replaceAll(` ${term} `, ` <strong>${term}</strong> `);
  });
  return highlightedContent;
};

export const ReviewContent = ({ content, isAssessment = false }: { content: string, isAssessment: boolean }): JSX.Element => (
  <section className={`${styles['review-content']}${isAssessment ? ` ${styles['review-content--assessment']}` : ''}`}>
    <div className={styles['review-content_body']} dangerouslySetInnerHTML={{ __html: isAssessment ? highlightTerms(content) : content }} />
    {isAssessment ? (
      <ul className={styles['review-content_links']}>
        <li className={styles['review-content_links-item']}><a href="#">Read the peer reviews</a></li>
        <li className={styles['review-content_links-item']}><a href="#">About eLife assessments</a></li>
      </ul>
    ) : ''}
  </section>
);
