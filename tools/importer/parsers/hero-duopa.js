/* eslint-disable */
/* global WebImporter */
/** Parser for hero block (duopa homepage). Uses base block name 'hero'. */
export default function parse(element, { document }) {
  const bgImg = element.querySelector('.abbv-background-container-display img');
  const heading = element.querySelector('h1');
  const subtitle = element.querySelector('.abbv-background-container-content-block p');

  const cells = [];
  if (bgImg) cells.push([bgImg]);

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);
  if (contentCell.length > 0) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
