/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-signup. Base: hero.
 * Source: https://www.botox.com/
 * Structure: Row 1 = block name, Row 2 = background image (optional), Row 3 = heading + text + CTAs
 * Source selectors from captured DOM: div.abbv-container.main-hero
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h1, h2, .hero-heading');

  // Extract supporting text and bullet list
  const subtitle = element.querySelector('p.content--large, .sign-up-text');
  const bulletList = element.querySelector('ul');

  // Extract CTAs
  const primaryCta = element.querySelector('a.abbv-button-primary');
  const loginLink = element.querySelector('.log-in a, a.underline');

  // Build content cell: heading + subtitle + bullets + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);
  if (bulletList) contentCell.push(bulletList);
  if (primaryCta) contentCell.push(primaryCta);
  if (loginLink) contentCell.push(loginLink);

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-signup', cells });
  element.replaceWith(block);
}
