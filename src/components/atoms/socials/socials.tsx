import './socials.scss';
import { useState } from 'react';

type Props = {
  doi: string,
  title: string
};

export const Socials = ({
  doi, title,
}: Props): JSX.Element => {
  const [showMastodonInputs, setShowMastodonInputs] = useState(false);
  const [mastodonAddress, setMastodonAddress] = useState<string>();

  const doiUrl = `https://doi.org/${doi}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(doiUrl);
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet/?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookUrl = `https://facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/shareArticle?title=${encodedTitle}&url=${encodedUrl}`;
  const redditUrl = `https://reddit.com/submit/?title=${encodedTitle}&url=${encodedUrl}`;
  const mastodonUrl = `https://${mastodonAddress}/share?text=${encodedTitle}%20${encodedUrl}}`;

  return (
    <div className="socials-container">
      <ul className="socials-sharers">
        <li>
          <a className="socials-sharer email" href={emailUrl} target="_blank" rel="noopener noreferrer" aria-label="Share by Email">
            Email
          </a>
        </li>
        <li>
          <a className="socials-sharer twitter" href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share by Twitter">
            Twitter
          </a>
        </li>
        <li>
          <a className="socials-sharer facebook" href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share by Facebook">
            Facebook
          </a>
        </li>
        <li>
          <a className="socials-sharer linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Share by LinkedIn">
            LinkedIn
          </a>
        </li>
        <li>
          <a className="socials-sharer reddit" href={redditUrl} target="_blank" rel="noopener noreferrer" aria-label="Share by Reddit">
            Reddit
          </a>
        </li>
        <li>
          <a className="socials-sharer mastadon" target="_blank" rel="noopener noreferrer" aria-label="Share by Mastadon with URL input" onClick={() => setShowMastodonInputs(!showMastodonInputs)}>
            Mastadon
          </a>
        </li>
      </ul>
      {showMastodonInputs &&
        <div className="socials-mastadon">
          <input className="socials-mastadon__input" placeholder="Mastadon URL" defaultValue={mastodonAddress ?? ''} onInput={(e) => setMastodonAddress(e.currentTarget.value)} />
          <a
            className="button button--action socials-mastadon__action"
            target="_blank"
            rel="noopener noreferrer"
            href={mastodonUrl}
            aria-label="Share by Mastodon">
            Share
          </a>
        </div>
      }
    </div>
  );
};
