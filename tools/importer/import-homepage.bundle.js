var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-signup.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1, h2, .hero-heading");
    const subtitle = element.querySelector("p.content--large, .sign-up-text");
    const bulletList = element.querySelector("ul");
    const primaryCta = element.querySelector("a.abbv-button-primary");
    const loginLink = element.querySelector(".log-in a, a.underline");
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subtitle) contentCell.push(subtitle);
    if (bulletList) contentCell.push(bulletList);
    if (primaryCta) contentCell.push(primaryCta);
    if (loginLink) contentCell.push(loginLink);
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-signup", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-hero.js
  function parse2(element, { document }) {
    const slides = element.querySelectorAll(".owl-item:not(.cloned) .item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img) {
        cells.push([img]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse3(element, { document }) {
    const statElements = element.querySelectorAll(".abbv-rich-text.hero__number");
    const row = [];
    statElements.forEach((stat) => {
      const content = stat.querySelector("p.content--large");
      if (content) {
        row.push(content);
      }
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-callout.js
  function parse4(element, { document }) {
    const imgEl = element.querySelector(".abbv-image-text-v2 img, .abbv-image-content-container-v2 img");
    const textContainer = element.querySelector(".abbv-container > .rich-text .abbv-rich-text, :scope > .container .abbv-rich-text");
    const cta = element.querySelector("a.abbv-button-primary");
    const footnotes = element.querySelectorAll(".notes, .text-indent");
    const textCell = document.createElement("div");
    if (textContainer) {
      Array.from(textContainer.children).forEach((child) => {
        textCell.appendChild(child.cloneNode(true));
      });
    }
    if (cta) textCell.appendChild(cta.cloneNode(true));
    footnotes.forEach((fn) => textCell.appendChild(fn.cloneNode(true)));
    const isCustomCallout = element.closest(".custom-callout") || element.classList.contains("custom-callout");
    const cells = [];
    if (isCustomCallout) {
      cells.push([textCell, imgEl || ""]);
    } else {
      cells.push([imgEl || "", textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-callout", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function parse5(element, { document }) {
    const slides = element.querySelectorAll(".owl-item:not(.cloned) .carousel__card");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".abbv-image-content-container-v2 img");
      const quote = slide.querySelector(".carousel__card-quote");
      const name = slide.querySelector(".carousel__card-title");
      const condition = slide.querySelector(".carousel__card-subtitle");
      const link = slide.querySelector("a.abbv-stretched-link, a.abbv-image-text-link");
      const textCell = document.createElement("div");
      if (quote) textCell.appendChild(quote.cloneNode(true));
      if (name) textCell.appendChild(name.cloneNode(true));
      if (condition) textCell.appendChild(condition.cloneNode(true));
      if (link) textCell.appendChild(link.cloneNode(true));
      cells.push([img || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse6(element, { document }) {
    const heading = element.querySelector("h3");
    const formRef = document.createElement("p");
    formRef.textContent = "Find a BOTOX\xAE Specialist";
    const contentCell = [];
    if (heading && heading.textContent.trim()) {
      contentCell.push(heading);
    }
    contentCell.push(formRef);
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-conditions.js
  function parse7(element, { document }) {
    const cards = element.querySelectorAll(".card--shadow");
    const cells = [];
    cards.forEach((card) => {
      const icon = card.querySelector(".abbv-image-content-container-v2 img");
      const textCell = document.createElement("div");
      const title = card.querySelector(".abbv-stretched-card-body p");
      if (title) {
        const h = document.createElement("strong");
        h.textContent = title.textContent;
        textCell.appendChild(h);
      }
      const links = card.querySelectorAll("a.cta--plain-large");
      links.forEach((link) => {
        const p = document.createElement("p");
        p.appendChild(link.cloneNode(true));
        textCell.appendChild(p);
      });
      const footnotes = card.querySelectorAll(".footnote.text-gray");
      footnotes.forEach((fn) => {
        textCell.appendChild(fn.cloneNode(true));
      });
      cells.push([icon || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-conditions", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/botox-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[id*="onetrust"]',
        ".g-recaptcha",
        ".promo-drawer",
        ".ghost",
        ".abbv-badgeless-captcha",
        '[class*="loading"]'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.abbv-header-v2",
        ".header-v2",
        "footer.abbv-footer",
        ".footer-container",
        ".abbv-skip-to-main-content",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-cmp");
      });
    }
  }

  // tools/importer/transformers/botox-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
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
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-signup": parse,
    "carousel-hero": parse2,
    "columns-stats": parse3,
    "columns-callout": parse4,
    "carousel-testimonial": parse5,
    "form": parse6,
    "cards-conditions": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Botox homepage with hero, product information, and brand messaging",
    urls: [
      "https://www.botox.com/"
    ],
    blocks: [
      {
        name: "hero-signup",
        instances: ["div.abbv-container.hero-section div.abbv-container.main-hero"]
      },
      {
        name: "carousel-hero",
        instances: ["div.abbv-carousel.carousel--hero"]
      },
      {
        name: "columns-stats",
        instances: ["div.abbv-container.hero--stats"]
      },
      {
        name: "columns-callout",
        instances: ["div.abbv-container.custom-callout", "div.abbv-container.callout"]
      },
      {
        name: "carousel-testimonial",
        instances: ["div.abbv-carousel.carousel--multi"]
      },
      {
        name: "form",
        instances: ["div.abbv-find-a-provider"]
      },
      {
        name: "cards-conditions",
        instances: ["div.abbv-container.flex--stretch.section--break"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "div.abbv-container.hero-section",
        style: null,
        blocks: ["hero-signup", "carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Trust Stats",
        selector: "div.abbv-container.hero--stats",
        style: null,
        blocks: ["columns-stats"],
        defaultContent: ["div.abbv-rich-text.hero__title", "div.hero--stats ~ div.rich-text"]
      },
      {
        id: "section-3",
        name: "Savings Callout",
        selector: "div.abbv-container.custom-callout",
        style: null,
        blocks: ["columns-callout"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Patient Stories",
        selector: "div.abbv-container.carousel--container",
        style: null,
        blocks: ["carousel-testimonial"],
        defaultContent: ["div.section--full > div.rich-text"]
      },
      {
        id: "section-5",
        name: "Find a Specialist",
        selector: ["div.abbv-container.callout", "div.abbv-find-a-provider"],
        style: null,
        blocks: ["columns-callout", "form"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Conditions Grid",
        selector: "div.abbv-container.section--full.background-color__gray-light",
        style: "grey",
        blocks: ["cards-conditions"],
        defaultContent: ["div.section--full.background-color__gray-light > div.rich-text", "div.callout.callout--center"]
      },
      {
        id: "section-7",
        name: "Important Safety Information",
        selector: "div.abbv-inline-use-isi",
        style: null,
        blocks: [],
        defaultContent: ["div.abbv-inline-safety", "div.abbv-inline-miscisi"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
