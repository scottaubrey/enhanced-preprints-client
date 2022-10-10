import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './site-header.module.scss';

const Overlay = (): JSX.Element => createPortal(<div className={styles['overlay']} id="overlayMainMenu"></div>, document.getElementsByTagName('BODY')[0]);

export const SiteHeader = (): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className={styles['site-header']}>
      <div className={styles['site-header-container']}>
        <img
          className={styles['site-header__logo']}
          src="/elife-logo.svg"
          alt="eLife logo"
          width="88"
          height="35"
        />

        {showMenu &&
            <>
              <Overlay/>
              <div className={`${styles['wrapper']} ${styles['main-menu']} ${styles['main-menu--js']} ${styles['main-menu--shown']}`} id="mainMenu" data-behaviour="MainMenu" tabIndex={0} aria-expanded="true" data-behaviour-initialised="true">
                <nav className={styles['main-menu__container']} role="navigation">
                  <button className={styles['main-menu__close_control']} id="mainMenuCloseControl" onClick={() => setShowMenu(false)}>Close</button>
                  <img
                      src="/elife-logo.svg"
                      alt="eLife logo"
                      width="88"
                      height="35"
                  />
                  <ul className={styles['main-menu__list']}>
                    <li className={`${styles['main-menu__list_item']} ${styles['hidden-wide']}`}>
                      <a href="https://elifesciences.org/" className={styles['main-menu__list_link']}>Home</a>
                    </li>
                    <li className={`${styles['main-menu__list_item']} ${styles['hidden-wide']}`}>
                      <a href="https://elifesciences.org/magazine" className={styles['main-menu__list_link']}>Magazine</a>
                    </li>
                    <li className={`${styles['main-menu__list_item']} ${styles['hidden-wide']}`}>
                      <a href="https://elifesciences.org/community" className={styles['main-menu__list_link']}>Community</a>
                    </li>
                    <li className={`${styles['main-menu__list_item']} ${styles['hidden-wide']}`}>
                      <a href="https://elifesciences.org/about" className={styles['main-menu__list_link']}>About</a>
                    </li>
                    <li className={styles['main-menu__list_item']}>
                      <a href="https://elifesciences.org/subjects" className={styles['main-menu__list_link']}>Research categories</a>
                    </li>
                    <li className={`${styles['main-menu__list_item']} ${styles['hidden-wide']} ${styles['end-of-group']}`}>
                      <a href="https://elifesciences.org/inside-elife" className={styles['main-menu__list_link']}>Inside eLife</a>
                    </li>
                    <li className={`${styles['main-menu__list_item']} ${styles['hidden-wide']}`}>
                      <a href="https://elifesciences.org/about" className={styles['main-menu__list_link']}>Search</a>
                    </li>
                    <li className={`${styles['main-menu__list_item']} ${styles['hidden-wide']} ${styles['end-of-group']}`}>
                      <a href="https://elifesciences.org/content-alerts" className={styles['main-menu__list_link']}>Subscribe to alerts</a>
                    </li>
                    <li className={styles['main-menu__list_item']}>
                      <a href="https://reviewer.elifesciences.org/login" className={styles['main-menu__list_link']}>Submit your research</a>
                    </li>
                    <li className={styles['main-menu__list_item']}>
                      <a href="https://reviewer.elifesciences.org/author-guide/editorial-process" className={styles['main-menu__list_link']}>Author guide</a>
                    </li>
                    <li className={styles['main-menu__list_item']}>
                      <a href="https://reviewer.elifesciences.org/reviewer-guide/review-process" className={styles['main-menu__list_link']}>Reviewer guide</a>
                    </li>
                  </ul>
                  <a href="#siteHeader" className={styles['to-top-link']}>Back to top</a>
                </nav>
              </div>
            </>
        }
        <nav className={styles['nav-primary']}>
          <ul className={styles['nav-primary__list']}>
            <li className={`${styles['nav-primary__item']} ${styles['nav-primary__item--first']}`}>
              <a href="#mainMenu" onClick={() => setShowMenu(true)}>Menu</a>
            </li>
            <li className={styles['nav-primary__item']}>
              <a href="#">Home</a>
            </li>
            <li className={styles['nav-primary__item']}>
              <a href="#">Magazine</a>
            </li>
            <li className={styles['nav-primary__item']}>
              <a href="#">Community</a>
            </li>
            <li className={styles['nav-primary__item']}>
              <a href="#">About</a>
            </li>
          </ul>
        </nav>

        <nav className={styles['nav-secondary']}>
          <ul className={styles['nav-secondary__list']}>
            <li className={`${styles['nav-secondary__item']} ${styles['nav-secondary__item--search']}`}>
              <a href="#" rel="search">Search</a>
            </li>
            <li className={`${styles['nav-secondary__item']} ${styles['nav-secondary__item--alert']}`}>
              <a href="#">Alerts</a>
            </li>
            <li className={styles['nav-secondary__item']}>
              <a href="#" className={`${styles['block-button']} ${styles['block-button__variant-one']}`}>Submit your research</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
