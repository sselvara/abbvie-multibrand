/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-stats. Base: columns.
 * Source: https://www.botox.com/
 * Structure: Multiple columns per row. Each column = one stat (number + description).
 * Source selectors from captured DOM: div.abbv-container.hero--stats
 */
export default function parse(element, { document }) {
  // Extract the stat columns (each .hero__number div)
  const statElements = element.querySelectorAll('.abbv-rich-text.hero__number');
  const row = [];

  statElements.forEach((stat) => {
    // Each stat has a large number span and description text
    const content = stat.querySelector('p.content--large');
    if (content) {
      row.push(content);
    }
  });

  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
