/* eslint-disable */
/* global WebImporter */

const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
