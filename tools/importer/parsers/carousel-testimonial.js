/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-testimonial. Base: carousel.
 * Source: https://www.botox.com/
 * Structure: 2 columns per row - image | text content. Each row = one testimonial slide.
 * Source selectors from captured DOM: div.abbv-carousel.carousel--multi
 * Only unique slides (non-cloned owl-item elements)
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.owl-item:not(.cloned) .carousel__card');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.abbv-image-content-container-v2 img');
    const quote = slide.querySelector('.carousel__card-quote');
    const name = slide.querySelector('.carousel__card-title');
    const condition = slide.querySelector('.carousel__card-subtitle');
    const link = slide.querySelector('a.abbv-stretched-link, a.abbv-image-text-link');

    // Build text content cell
    const textCell = document.createElement('div');
    if (quote) textCell.appendChild(quote.cloneNode(true));
    if (name) textCell.appendChild(name.cloneNode(true));
    if (condition) textCell.appendChild(condition.cloneNode(true));
    if (link) textCell.appendChild(link.cloneNode(true));

    cells.push([img || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
  element.replaceWith(block);
}
