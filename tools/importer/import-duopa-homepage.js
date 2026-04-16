/* eslint-disable */
/* global WebImporter */

import heroDuopaParser from './parsers/hero-duopa.js';
import cardsBenefitsParser from './parsers/cards-benefits.js';
import columnsMentorParser from './parsers/columns-mentor.js';
import heroStoriesParser from './parsers/hero-stories.js';

import duopaCleanupTransformer from './transformers/duopa-cleanup.js';
import duopaSectionsTransformer from './transformers/duopa-sections.js';

const parsers = {
  'hero': heroDuopaParser,
  'cards': cardsBenefitsParser,
  'columns-mentor': columnsMentorParser,
  'hero-stories': heroStoriesParser,
};

const PAGE_TEMPLATE = {
  name: 'duopa-homepage',
  description: 'Duopa homepage with hero, benefits, peer mentor, patient stories, and safety information',
  urls: ['https://www.duopa.com/'],
  blocks: [
    { name: 'hero', instances: ['div.abbv-background-container.duopa-hero-home-bg'] },
    { name: 'cards', instances: ['div.abbv-container.duopa-whitecontainer'] },
    { name: 'columns-mentor', instances: ['div.abbv-container.duopa-blue-container-1'] },
    { name: 'hero-stories', instances: ['div.abbv-background-container.patient-story'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: 'div.abbv-background-container.duopa-hero-home-bg', style: null, blocks: ['hero', 'cards'], defaultContent: [] },
    { id: 'section-2', name: 'Peer Mentor', selector: 'div.abbv-container.duopa-blue-container-1', style: 'dark', blocks: ['columns-mentor'], defaultContent: [] },
    { id: 'section-3', name: 'Patient Stories', selector: 'div.abbv-background-container.patient-story', style: null, blocks: ['hero-stories'], defaultContent: [] },
    { id: 'section-4', name: 'Navigation', selector: 'a.duopa-button-next-page', style: null, blocks: [], defaultContent: ['a.duopa-button-next-page'] },
    { id: 'section-5', name: 'Safety Information', selector: 'div.abbv-inline-use-isi', style: null, blocks: [], defaultContent: ['div.abbv-inline-use-isi'] },
  ],
};

const transformers = [
  duopaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [duopaSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name}:`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      '/duopa' + (new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
