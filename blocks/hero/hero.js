import { renderBlock } from '../../scripts/multi-theme.js';

export function decorateBlock(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }
}

export default async function decorate(block) {
  renderBlock(block);
}
