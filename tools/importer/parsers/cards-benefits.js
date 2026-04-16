/* eslint-disable */
/* global WebImporter */
/** Parser for cards block (duopa benefits). Uses base block name 'cards'. */
export default function parse(element, { document }) {
  const heading = element.querySelector('h4');
  const flexItems = element.querySelectorAll('.abbv-flex-item');
  const footnoteDiv = element.querySelector('.footnote');
  const lowerText = element.querySelector('.lower-text');

  const cells = [];

  flexItems.forEach((item) => {
    const icon = item.querySelector('img');
    const textDiv = document.createElement('div');
    const h5 = item.querySelector('h5');
    const p = item.querySelector('p');
    if (h5) textDiv.appendChild(h5.cloneNode(true));
    if (p) textDiv.appendChild(p.cloneNode(true));
    cells.push([icon || '', textDiv]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });

  const wrapper = document.createElement('div');
  if (heading) wrapper.appendChild(heading);
  wrapper.appendChild(block);
  if (lowerText) wrapper.appendChild(lowerText);
  if (footnoteDiv) wrapper.appendChild(footnoteDiv);

  element.replaceWith(wrapper);
}
