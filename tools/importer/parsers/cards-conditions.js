/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-conditions. Base: cards.
 * Source: https://www.botox.com/
 * Structure: 2 columns per row - image | text. Each row = one condition card.
 * Source selectors from captured DOM: div.abbv-container.flex--stretch.section--break
 * Each card has icon image + category title + condition links
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.card--shadow');
  const cells = [];

  cards.forEach((card) => {
    const icon = card.querySelector('.abbv-image-content-container-v2 img');

    // Build text cell: category title + condition links with descriptions
    const textCell = document.createElement('div');

    // Category title from stretched card body
    const title = card.querySelector('.abbv-stretched-card-body p');
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title.textContent;
      textCell.appendChild(h);
    }

    // Condition links (CTA elements)
    const links = card.querySelectorAll('a.cta--plain-large');
    links.forEach((link) => {
      const p = document.createElement('p');
      p.appendChild(link.cloneNode(true));
      textCell.appendChild(p);
    });

    // Footnote descriptions
    const footnotes = card.querySelectorAll('.footnote.text-gray');
    footnotes.forEach((fn) => {
      textCell.appendChild(fn.cloneNode(true));
    });

    cells.push([icon || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-conditions', cells });
  element.replaceWith(block);
}
