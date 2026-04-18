/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSignupParser from './parsers/hero-signup.js';
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsStatsParser from './parsers/columns-stats.js';
import columnsCalloutParser from './parsers/columns-callout.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import formParser from './parsers/form.js';
import cardsConditionsParser from './parsers/cards-conditions.js';

// TRANSFORMER IMPORTS
import botoxCleanupTransformer from './transformers/botox-cleanup.js';
import botoxSectionsTransformer from './transformers/botox-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-signup': heroSignupParser,
  'carousel-hero': carouselHeroParser,
  'columns-stats': columnsStatsParser,
  'columns-callout': columnsCalloutParser,
  'carousel-testimonial': carouselTestimonialParser,
  'form': formParser,
  'cards-conditions': cardsConditionsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Botox homepage with hero, product information, and brand messaging',
  urls: [
    'https://www.botox.com/'
  ],
  blocks: [
    {
      name: 'hero-signup',
      instances: ['div.abbv-container.hero-section div.abbv-container.main-hero']
    },
    {
      name: 'carousel-hero',
      instances: ['div.abbv-carousel.carousel--hero']
    },
    {
      name: 'columns-stats',
      instances: ['div.abbv-container.hero--stats']
    },
    {
      name: 'columns-callout',
      instances: ['div.abbv-container.custom-callout', 'div.abbv-container.callout']
    },
    {
      name: 'carousel-testimonial',
      instances: ['div.abbv-carousel.carousel--multi']
    },
    {
      name: 'form',
      instances: ['div.abbv-find-a-provider']
    },
    {
      name: 'cards-conditions',
      instances: ['div.abbv-container.flex--stretch.section--break']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'div.abbv-container.hero-section',
      style: null,
      blocks: ['hero-signup', 'carousel-hero'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Trust Stats',
      selector: 'div.abbv-container.hero--stats',
      style: null,
      blocks: ['columns-stats'],
      defaultContent: ['div.abbv-rich-text.hero__title', 'div.hero--stats ~ div.rich-text']
    },
    {
      id: 'section-3',
      name: 'Savings Callout',
      selector: 'div.abbv-container.custom-callout',
      style: null,
      blocks: ['columns-callout'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Patient Stories',
      selector: 'div.abbv-container.carousel--container',
      style: null,
      blocks: ['carousel-testimonial'],
      defaultContent: ['div.section--full > div.rich-text']
    },
    {
      id: 'section-5',
      name: 'Find a Specialist',
      selector: ['div.abbv-container.callout', 'div.abbv-find-a-provider'],
      style: null,
      blocks: ['columns-callout', 'form'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Conditions Grid',
      selector: 'div.abbv-container.section--full.background-color__gray-light',
      style: 'grey',
      blocks: ['cards-conditions'],
      defaultContent: ['div.section--full.background-color__gray-light > div.rich-text', 'div.callout.callout--center']
    },
    {
      id: 'section-7',
      name: 'Important Safety Information',
      selector: 'div.abbv-inline-use-isi',
      style: null,
      blocks: [],
      defaultContent: ['div.abbv-inline-safety', 'div.abbv-inline-miscisi']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  botoxCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [botoxSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
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
