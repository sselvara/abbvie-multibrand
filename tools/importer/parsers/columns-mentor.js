/* eslint-disable */
/* global WebImporter */
/** Parser for columns block (duopa mentor section). Uses base 'columns' with 'mentor' variation. */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1');
  const textDiv = element.querySelector('.abbv-rich-text.duopa-blue-container-1-top-text');
  const cta = element.querySelector('a.abbv-button-primary');
  const disclaimer = element.querySelector('.Body-text-9');

  const leftCell = document.createElement('div');
  if (heading) leftCell.appendChild(heading.cloneNode(true));

  const rightCell = document.createElement('div');
  if (textDiv) {
    Array.from(textDiv.children).forEach((child) => {
      rightCell.appendChild(child.cloneNode(true));
    });
  }
  if (cta) rightCell.appendChild(cta.cloneNode(true));
  if (disclaimer) {
    Array.from(disclaimer.children).forEach((child) => {
      rightCell.appendChild(child.cloneNode(true));
    });
  }

  const cells = [[leftCell, rightCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns (mentor)', cells });
  element.replaceWith(block);
}
