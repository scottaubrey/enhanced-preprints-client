import { Content } from '../../../types/content';
import { contentToJsx } from '../../../utils/content-to-jsx';
import styles from './heading.module.scss';

type HeadingProps = {
  content: Content,
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6,
  id: string,
  className?: string,
};

export const Heading = ({
  headingLevel, content, id, className,
}: HeadingProps): JSX.Element => {
  const normalisedClassName = className || styles[`heading-${headingLevel}`];
  // eslint-disable-next-line default-case
  switch (headingLevel) {
    case 1:
      return <h1 id={id} className={normalisedClassName}>{contentToJsx(content)}</h1>;
    case 2:
      return <h2 id={id} className={normalisedClassName}>{contentToJsx(content)}</h2>;
    case 3:
      return <h3 id={id} className={normalisedClassName}>{contentToJsx(content)}</h3>;
    case 4:
      return <h4 id={id} className={normalisedClassName}>{contentToJsx(content)}</h4>;
    case 5:
      return <h5 id={id} className={normalisedClassName}>{contentToJsx(content)}</h5>;
    case 6:
    default:
      return <h6 id={id} className={normalisedClassName}>{contentToJsx(content)}</h6>;
  }
};
