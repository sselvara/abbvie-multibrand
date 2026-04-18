/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.botox.com/
 * Structure: 2 columns per row - image | text (optional). Each row = one slide.
 * Source selectors from captured DOM: div.abbv-carousel.carousel--hero
 * Only unique slides (non-cloned owl-item elements)
 */
export default function parse(element, { document }) {
  // Get only non-cloned slide items
  const slides = element.querySelectorAll('.owl-item:not(.cloned) .item');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (img) {
      // Carousel hero is image-only slides - image in col 1, empty col 2
      cells.push([img]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
