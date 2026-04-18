/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-callout. Base: columns.
 * Source: https://www.botox.com/
 * Structure: 2 columns per row - text content | image (or image | text).
 * Source selectors from captured DOM: div.abbv-container.custom-callout, div.abbv-container.callout
 * Handles both savings callout (text+image) and treatment callout (image+text).
 */
export default function parse(element, { document }) {
  // Find the image element
  const imgEl = element.querySelector('.abbv-image-text-v2 img, .abbv-image-content-container-v2 img');

  // Find the text container (rich-text with callout content or general text)
  const textContainer = element.querySelector('.abbv-container > .rich-text .abbv-rich-text, :scope > .container .abbv-rich-text');

  // Find CTA button
  const cta = element.querySelector('a.abbv-button-primary');

  // Find footnotes
  const footnotes = element.querySelectorAll('.notes, .text-indent');

  // Build text cell
  const textCell = document.createElement('div');
  if (textContainer) {
    // Clone all child nodes from the rich text
    Array.from(textContainer.children).forEach((child) => {
      textCell.appendChild(child.cloneNode(true));
    });
  }
  if (cta) textCell.appendChild(cta.cloneNode(true));
  footnotes.forEach((fn) => textCell.appendChild(fn.cloneNode(true)));

  // Determine order: if image is in .custom-callout, text first then image
  // If image is in .callout (treatment), image first then text
  const isCustomCallout = element.closest('.custom-callout') || element.classList.contains('custom-callout');
  const cells = [];

  if (isCustomCallout) {
    cells.push([textCell, imgEl || '']);
  } else {
    cells.push([imgEl || '', textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-callout', cells });
  element.replaceWith(block);
}
