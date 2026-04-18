/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form. Base: form (no variant - forms plugin).
 * Source: https://www.botox.com/
 * Structure: 2 rows - row 1 = block name, row 2 = form link/reference.
 * Source selectors from captured DOM: div.abbv-find-a-provider
 * Form blocks use JSON definitions; parser creates a placeholder block.
 */
export default function parse(element, { document }) {
  // Extract the form heading if present
  const heading = element.querySelector('h3');

  // Create a placeholder reference for the form
  const formRef = document.createElement('p');
  formRef.textContent = 'Find a BOTOX® Specialist';

  const contentCell = [];
  if (heading && heading.textContent.trim()) {
    contentCell.push(heading);
  }
  contentCell.push(formRef);

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
