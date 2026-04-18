/* eslint-disable */
/* global WebImporter */
/** Parser for carousel block (quliptahcp patient stories). Uses base block name 'carousel'. */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.owl-item:not(.cloned)');
  const cells = [];

  slides.forEach((slide) => {
    const photo = slide.querySelector('.abbv-image-content-container-v2 img, .patient-photo img');
    const nameEl = slide.querySelector('.patient--title p:first-child');
    const subtitleEl = slide.querySelector('.patient--title p:nth-child(2)');
    const bioList = slide.querySelector('.patient--title + ul, .patient-bio ul');

    const beforeTitle = slide.querySelector('.violator-content--bg-white .abbv-rich-text p:first-child');
    const beforeQuote = slide.querySelector('.violator-content--bg-white .abbv-rich-text p:nth-child(2)');
    const beforeList = slide.querySelector('.violator-content--bg-white ul');

    const afterSection = slide.querySelector('.violator-content--background, .violator-title--top-left-curve');
    const afterTitle = afterSection?.querySelector('p:first-child');
    const afterQuote = afterSection?.querySelector('p:nth-child(2)');
    const afterList = afterSection?.querySelector('ul');
    const afterLinks = afterSection?.querySelectorAll('a');

    const disclaimer = slide.querySelector('.disclaimer p, .patient-disclaimer p');

    // Build content cell with all patient info
    const contentCell = document.createElement('div');

    if (nameEl) {
      const h3 = document.createElement('h3');
      h3.textContent = nameEl.textContent.trim();
      contentCell.appendChild(h3);
    }
    if (subtitleEl) {
      const sub = document.createElement('p');
      sub.innerHTML = `<em>${subtitleEl.textContent.trim()}</em>`;
      contentCell.appendChild(sub);
    }
    if (bioList) contentCell.appendChild(bioList.cloneNode(true));

    if (beforeTitle) {
      const bh = document.createElement('h4');
      bh.textContent = beforeTitle.textContent.trim();
      contentCell.appendChild(bh);
    }
    if (beforeQuote) {
      const bq = document.createElement('p');
      bq.innerHTML = `<strong>${beforeQuote.textContent.trim()}</strong>`;
      contentCell.appendChild(bq);
    }
    if (beforeList) contentCell.appendChild(beforeList.cloneNode(true));

    if (afterTitle) {
      const ah = document.createElement('h4');
      ah.textContent = afterTitle.textContent.trim();
      contentCell.appendChild(ah);
    }
    if (afterQuote) {
      const aq = document.createElement('p');
      aq.innerHTML = `<strong>${afterQuote.textContent.trim()}</strong>`;
      contentCell.appendChild(aq);
    }
    if (afterList) contentCell.appendChild(afterList.cloneNode(true));
    if (afterLinks) {
      afterLinks.forEach((link) => {
        const p = document.createElement('p');
        p.appendChild(link.cloneNode(true));
        contentCell.appendChild(p);
      });
    }

    if (disclaimer) contentCell.appendChild(disclaimer.cloneNode(true));

    cells.push([photo || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
