/* eslint-disable */
/* global WebImporter */
/** Parser for hero block (duopa patient stories). Uses base 'hero' with 'stories' variation. */
export default function parse(element, { document }) {
  const bgImg = element.querySelector('.abbv-background-container-display img');
  const contentBlock = element.querySelector('.abbv-background-container-content-block-display');

  const cells = [];
  if (bgImg) cells.push([bgImg]);

  if (contentBlock) {
    const contentCell = [];
    Array.from(contentBlock.children).forEach((child) => {
      contentCell.push(child.cloneNode(true));
    });
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero (stories)', cells });
  element.replaceWith(block);
}
