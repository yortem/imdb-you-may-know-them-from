(function () {
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const delay = ms => new Promise(r => setTimeout(r, ms));

  function idFromHref(href) {
    const m = href.match(/\/title\/(tt\d+)\//);
    return m ? m[1] : null;
  }

  function extractRatedCredits() {
    const items = [];
    const seen = new Set();

    for (const userStar of $$('.ipc-rating-star--currentUser')) {
      const li = userStar.closest('li');
      if (!li || !li.dataset?.testid?.startsWith('cred_')) continue;

      const titleLink = li.querySelector('.ipc-metadata-list-summary-item__t');
      if (!titleLink) continue;

      const href = titleLink.getAttribute('href') || '';
      const id = idFromHref(href);
      if (!id || seen.has(id)) continue;
      seen.add(id);

      const title = titleLink.textContent.trim();
      const ratingEl = li.querySelector('.ipc-rating-star--currentUser .ipc-rating-star--rating');
      const rating = ratingEl ? parseInt(ratingEl.textContent.trim(), 10) : 0;

      const roleItem = li.querySelector('[data-testid="credit-roles-list"] li span');
      const character = roleItem ? roleItem.textContent.trim() : '';

      const yearSpan = li.querySelector('.ipc-metadata-list-summary-item__cc li span');
      const year = yearSpan ? yearSpan.textContent.trim() : '';

      const img = li.querySelector('.ipc-poster img.ipc-image');
      const poster = img ? img.getAttribute('src') : '';

      items.push({ id, title, rating, character, year, poster, url: href });
    }

    return items;
  }

  function findAnchor() {
    return (
      $('[data-testid="nm_flmg_kwn_for"]') ||
      $('section[data-testid="nm_flmg_kwn_for"]') ||
      $('[data-testid="name-bio"]')
    );
  }

  function clickSeeAllButtons() {
    let n = 0;
    for (const btn of $$('.ipc-see-more__button')) {
      if (btn.textContent.trim().toLowerCase() === 'see all' && !btn.disabled) {
        btn.click(); n++;
      }
    }
    return n;
  }

  function expandAccordions() {
    let n = 0;
    for (const el of $$('label[aria-expanded="false"]')) {
      if (el.dataset.testid?.startsWith('accordion-item-')) {
        el.click(); n++;
      }
    }
    return n;
  }

  async function waitForContent() {
    for (let i = 0; i < 30; i++) {
      if ($('.ipc-rating-star--currentUser')) return true;
      await delay(500);
    }
    return false;
  }

  function createCard(item) {
    const card = document.createElement('div');
    card.className =
      'ipc-list-card--span ipc-list-card--border-line ipc-list-card--click ipc-list-card--base ipc-list-card ipc-primary-image-list-card ipc-primary-image-list-card--base ipc-primary-image-list-card--click ipc-primary-image-list-card--media-radius sc-ad2b0d81-0 kLBibl ipc-sub-grid-item ipc-sub-grid-item--span-4 ymktf-card';
    card.setAttribute('data-testid', `ymktf_${item.id}`);

    const posterBox = document.createElement('div');
    posterBox.className =
      'ipc-poster ipc-poster--base ipc-poster--media-radius ipc-poster--wl-true ipc-poster--dynamic-width ipc-primary-image-list-card__poster ipc-primary-image-list-card__poster--poster-27x40 ipc-sub-grid-item ipc-sub-grid-item--span-2';
    posterBox.setAttribute('role', 'group');

    if (item.poster) {
      posterBox.innerHTML = `<div class="ipc-media ipc-media--poster-27x40 ipc-image-media-ratio--poster-27x40 ipc-media--media-radius ipc-media--base ipc-media--poster-s ipc-poster__poster-image ipc-media__img" style="width:100%"><img alt="${item.title.replace(/"/g, '&quot;')}" class="ipc-image" loading="lazy" src="${item.poster}" width="90"></div>`;
    } else {
      posterBox.innerHTML = `<div class="ipc-media ipc-media--poster-27x40 ipc-image-media-ratio--poster-27x40 ipc-media--media-radius ipc-media--base ipc-media--poster-s ipc-poster__poster-image ipc-media__img" style="width:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;color:#787878;font-size:11px;text-align:center;padding:4px;height:133px;width:90px;box-sizing:border-box">${item.title.replace(/"/g, '&quot;')}</div>`;
    }

    const content = document.createElement('div');
    content.className = 'ipc-primary-image-list-card__content';

    const top = document.createElement('div');
    top.className = 'ipc-primary-image-list-card__content-top';
    top.innerHTML = `<a class="ipc-primary-image-list-card__title" tabindex="0" href="/title/${item.id}/">${item.title.replace(/"/g, '&quot;')}</a>`;

    const midTop = document.createElement('div');
    midTop.className = 'ipc-primary-image-list-card__content-mid-top';
    midTop.innerHTML = `<div class="ipc-rating-star-group"><span class="ipc-rating-star ipc-rating-star--base ipc-rating-star--currentUser ipc-rating-star-group--currentUser"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ipc-icon ipc-icon--star-inline" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg><span class="ipc-rating-star--rating">${item.rating}</span></span></div>`;

    const midBot = document.createElement('div');
    midBot.className = 'ipc-primary-image-list-card__content-mid-bottom';
    if (item.character) {
      midBot.innerHTML = `<ul class="ipc-inline-list ipc-inline-list--show-dividers ipc-inline-list--no-wrap ipc-inline-list--inline ipc-primary-image-list-card__secondary base" role="presentation"><li role="presentation" class="ipc-inline-list__item ipc-primary-image-list-card__secondary-item"><span class="ipc-primary-image-list-card__secondary-text">${item.character.replace(/"/g, '&quot;')}</span></li></ul>`;
    }

    const bot = document.createElement('div');
    bot.className = 'ipc-primary-image-list-card__content-bottom';
    bot.innerHTML = `<ul class="ipc-inline-list ipc-inline-list--show-dividers ipc-inline-list--no-wrap ipc-inline-list--inline ipc-primary-image-list-card__title-metadata base" role="presentation"><li role="presentation" class="ipc-inline-list__item ipc-primary-image-list-card__secondary-item"><span class="ipc-primary-image-list-card__secondary-text">${item.year}</span></li></ul>`;

    content.append(top, midTop, midBot, bot);
    card.append(posterBox, content);
    card.addEventListener('click', () => {
      window.open(`https://www.imdb.com/title/${item.id}/`, '_blank');
    });
    card.style.cursor = 'pointer';
    return card;
  }

  function injectSection(items) {
    const anchor = findAnchor();
    if (!anchor) return;

    const section = document.createElement('section');
    section.className = 'ipc-page-section ipc-page-section--base ymktf-section';
    section.setAttribute('data-testid', 'ymktf_section');

    const titleHtml = `<div class="ipc-title ipc-title--base ipc-title--section-title ipc-title--on-textPrimary"><h2 class="ipc-title__text"><span id="ymktf_title">You Know Them From</span><a class="ipc-title-link-wrapper ymktf-repo-link" href="https://github.com/yortem/imdb-you-may-know-them-from" target="_blank" title="yortem/imdb-you-may-know-them-from"><svg width="24" height="24" class="ipc-icon ipc-icon--link ipc-icon--inline ipc-title-link" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M17 7h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c1.65 0 3 1.35 3 3s-1.35 3-3 3h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-9 5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1zm2 3H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h3c.55 0 1-.45 1-1s-.45-1-1-1H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h3c.55 0 1-.45 1-1s-.45-1-1-1z"></path></svg></a></h2></div>`;
    section.innerHTML = titleHtml;

    const subtitle = document.createElement('div');
    subtitle.style.cssText =
      'color:#787878;font-size:14px;margin:0 0 16px 0;padding:0 20px';
    subtitle.textContent = `Movies & shows you've rated (${items.length} match${items.length > 1 ? 'es' : ''})`;
    section.append(subtitle);

    const grid = document.createElement('div');
    grid.className =
      'ipc-sub-grid ipc-sub-grid--page-span-2 ipc-sub-grid--wraps-at-above-l ipc-shoveler__grid';
    grid.setAttribute('data-testid', 'ymktf_grid');

    const maxShow = 4;
    const showAll = items.length <= maxShow;
    const toShow = showAll ? items : items.slice(0, maxShow);

    for (const item of toShow) {
      grid.appendChild(createCard(item));
    }

    section.append(grid);

    if (!showAll) {
      const pagination = document.createElement('div');
      pagination.className = 'sc-214bbbd5-1 jARfPC pagination-container';
      pagination.style.cssText = 'margin-top:12px';

      const seeMore = document.createElement('span');
      seeMore.className =
        'ipc-see-more sc-e2b012eb-0 QEaqv chained-see-more-button sc-214bbbd5-2 sc-89d02203-1 dAHUOd';

      const btn = document.createElement('button');
      btn.className =
        'ipc-btn ipc-btn--single-padding ipc-btn--center-align-content ipc-btn--default-height ipc-btn--core-base ipc-btn--theme-base ipc-btn--button-radius ipc-btn--on-accent2 ipc-text-button ipc-see-more__button';
      btn.tabIndex = 0;
      btn.innerHTML = `<span class="ipc-btn__text"><span class="ipc-see-more__text">See all</span></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--expand-more ipc-btn__icon ipc-btn__icon--post" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path opacity=".87" fill="none" d="M24 24H0V0h24v24z"></path><path d="M15.88 9.29L12 13.17 8.12 9.29a.996.996 0 1 0-1.41 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41c-.39-.38-1.03-.39-1.42 0z"></path></svg>`;

      btn.addEventListener('click', () => {
        grid.innerHTML = '';
        for (const item of items) {
          grid.appendChild(createCard(item));
        }
        pagination.remove();
      });
      seeMore.appendChild(btn);
      pagination.appendChild(seeMore);
      section.append(pagination);
    }

    anchor.parentNode.insertBefore(section, anchor.nextSibling);
  }

  function injectMessage(body, showOptions) {
    const anchor = findAnchor();
    if (!anchor) return;

    const section = document.createElement('section');
    section.className = 'ipc-page-section ipc-page-section--base ymktf-section';
    section.innerHTML = `<div class="ipc-title ipc-title--base ipc-title--section-title"><h2 class="ipc-title__text"><span>You Know Them From</span></h2></div>
      <div style="padding:20px;color:#787878;font-size:14px">${body}</div>`;
    if (showOptions) {
      const btn = document.createElement('button');
      btn.textContent = 'Open Options';
      btn.style.cssText =
        'margin:0 20px 20px;padding:8px 24px;background:#f5c518;color:#000;border:none;border-radius:24px;font-weight:600;cursor:pointer;font-size:14px';
      btn.addEventListener('click', () => chrome.runtime.openOptionsPage());
      section.append(btn);
    }
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
    return section;
  }

  async function init() {
    const pathMatch = location.pathname.match(/^\/name\/(nm\d+)\/?/);
    if (!pathMatch) return;

    const anchor = findAnchor();
    if (!anchor) return;

    const hasRatings = await waitForContent();
    if (!hasRatings) return;

    expandAccordions();
    let more = clickSeeAllButtons();
    if (more > 0) await delay(2000);
    else await delay(800);

    const items = extractRatedCredits();
    if (items.length === 0) {
      injectMessage('No rated titles found for this person. Make sure you\'re logged in to IMDB and have rated some of their work.');
      return;
    }

    injectSection(items);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
