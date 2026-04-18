/* eslint-disable */
/* global WebImporter */

import carouselParser from './parsers/carousel-patient-stories.js';
import cleanupTransformer from './transformers/quliptahcp-cleanup.js';

const parsers = {
  'carousel': carouselParser,
};

const PAGE_TEMPLATE = {
  name: 'quliptahcp-patient-stories',
  description: 'QULIPTA HCP patient stories page with carousel of patient testimonials',
  urls: ['https://www.quliptahcp.com/patient-stories'],
  blocks: [
    { name: 'carousel', instances: ['div.carousel-patient-stories'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.violator-title', style: null, blocks: [], defaultContent: ['.violator-title h1'] },
    { id: 'section-2', name: 'Patient Stories', selector: 'div.carousel-patient-stories', style: null, blocks: ['carousel'], defaultContent: [] },
    { id: 'section-3', name: 'CTA', selector: 'a.qulipta-bottom-cta', style: null, blocks: [], defaultContent: ['a.qulipta-bottom-cta'] },
    { id: 'section-4', name: 'Safety Info', selector: '.abbv-inline-use-isi', style: null, blocks: [], defaultContent: ['.abbv-inline-use-isi'] },
  ],
};

const transformers = [cleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
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
        try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name}:`, e); }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      '/quliptahcp' + new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
