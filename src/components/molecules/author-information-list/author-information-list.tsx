import { Fragment } from 'react';
import { Author } from '../../../types';
import { createAuthorId } from '../../../utils/create-author-id';
import './author-information-list.scss';
import { Copyright } from '../../atoms/copyright/copyright';

const AuthorInformation = ({ author }: { author: Author }) => {
  const orcids = (author.identifiers ?? []).filter(({ type, propertyID }) => type === 'orcid' || (type === 'PropertyValue' && propertyID === 'https://registry.identifiers.org/registry/orcid'));

  return (
    <li className="author-list__author">
      <h4 id={createAuthorId(author)} className="author-list__author_name">{author.type === 'Organization' ?
        author.name :
        `${(author.givenNames ?? []).join(' ')} ${(author.familyNames ?? []).join(' ')}${author.honorificSuffix ? ` ${author.honorificSuffix}` : ''}`}</h4>
      {
        author.affiliations && (
          <div className="author-list__affiliations">
            {author.affiliations.map(({ name, address }) => `${name}${address ? `, ${address.addressCountry}` : ''}`).join(', ')}
          </div>
        )
      }

      {author.emails ? <div className="author-list__email"><h5 className="author-list__email--heading">For correspondence:</h5> <span className="author-list__email">{author.emails}</span></div> : '' }

      {
        orcids.length > 0 && (
          <div className="author-list__orcids">
            ORCID iD: {orcids.map(({ value }, index) => (<Fragment key={index}>{!!index && ', '}<a className="author-list__orcids_link" href={value}>{value.substring(value.lastIndexOf('/') + 1)}</a></Fragment>))}
          </div>
        )
      }
    </li>
  );
};

export const AuthorInformationList = ({ authors, license, publishedYear }: { authors: Author[], license?: string, publishedYear?: number }) => (
  <section id="author-list" className="author-list">
    <h2 id="author-information" className="author-list__title">Article and author information</h2>
    <ol className="author-list__authors">
      {authors.map((author, index) => <AuthorInformation author={author} key={index}/>)}
    </ol>
    { license && (<Copyright license={license} publishedYear={publishedYear} authors={authors} />)}
  </section>
);
