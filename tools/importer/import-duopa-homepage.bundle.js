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

  // tools/importer/import-duopa-homepage.js
  var import_duopa_homepage_exports = {};
  __export(import_duopa_homepage_exports, {
    default: () => import_duopa_homepage_default
  });

  // tools/importer/parsers/hero-duopa.js
  function parse(element, { document }) {
    const bgImg = element.querySelector(".abbv-background-container-display img");
    const heading = element.querySelector("h1");
    const subtitle = element.querySelector(".abbv-background-container-content-block p");
    const cells = [];
    if (bgImg) cells.push([bgImg]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subtitle) contentCell.push(subtitle);
    if (contentCell.length > 0) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-benefits.js
  function parse2(element, { document }) {
    const heading = element.querySelector("h4");
    const flexItems = element.querySelectorAll(".abbv-flex-item");
    const footnoteDiv = element.querySelector(".footnote");
    const lowerText = element.querySelector(".lower-text");
    const cells = [];
    flexItems.forEach((item) => {
      const icon = item.querySelector("img");
      const textDiv = document.createElement("div");
      const h5 = item.querySelector("h5");
      const p = item.querySelector("p");
      if (h5) textDiv.appendChild(h5.cloneNode(true));
      if (p) textDiv.appendChild(p.cloneNode(true));
      cells.push([icon || "", textDiv]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    const wrapper = document.createElement("div");
    if (heading) wrapper.appendChild(heading);
    wrapper.appendChild(block);
    if (lowerText) wrapper.appendChild(lowerText);
    if (footnoteDiv) wrapper.appendChild(footnoteDiv);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/columns-mentor.js
  function parse3(element, { document }) {
    const heading = element.querySelector("h1");
    const textDiv = element.querySelector(".abbv-rich-text.duopa-blue-container-1-top-text");
    const cta = element.querySelector("a.abbv-button-primary");
    const disclaimer = element.querySelector(".Body-text-9");
    const leftCell = document.createElement("div");
    if (heading) leftCell.appendChild(heading.cloneNode(true));
    const rightCell = document.createElement("div");
    if (textDiv) {
      Array.from(textDiv.children).forEach((child) => {
        rightCell.appendChild(child.cloneNode(true));
      });
    }
    if (cta) rightCell.appendChild(cta.cloneNode(true));
    if (disclaimer) {
      Array.from(disclaimer.children).forEach((child) => {
        rightCell.appendChild(child.cloneNode(true));
      });
    }
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns (mentor)", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-stories.js
  function parse4(element, { document }) {
    const bgImg = element.querySelector(".abbv-background-container-display img");
    const contentBlock = element.querySelector(".abbv-background-container-content-block-display");
    const cells = [];
    if (bgImg) cells.push([bgImg]);
    if (contentBlock) {
      const contentCell = [];
      Array.from(contentBlock.children).forEach((child) => {
        contentCell.push(child.cloneNode(true));
      });
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero (stories)", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/duopa-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[id*="onetrust"]',
        ".abbv-dimmer",
        ".abbv-safety-bar",
        ".abbv-hide"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        ".header-v2",
        "footer",
        ".abbv-footer",
        ".abbv-skip-to-main-content",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/duopa-sections.js
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

  // tools/importer/import-duopa-homepage.js
  var parsers = {
    "hero": parse,
    "cards": parse2,
    "columns-mentor": parse3,
    "hero-stories": parse4
  };
  var PAGE_TEMPLATE = {
    name: "duopa-homepage",
    description: "Duopa homepage with hero, benefits, peer mentor, patient stories, and safety information",
    urls: ["https://www.duopa.com/"],
    blocks: [
      { name: "hero", instances: ["div.abbv-background-container.duopa-hero-home-bg"] },
      { name: "cards", instances: ["div.abbv-container.duopa-whitecontainer"] },
      { name: "columns-mentor", instances: ["div.abbv-container.duopa-blue-container-1"] },
      { name: "hero-stories", instances: ["div.abbv-background-container.patient-story"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: "div.abbv-background-container.duopa-hero-home-bg", style: null, blocks: ["hero", "cards"], defaultContent: [] },
      { id: "section-2", name: "Peer Mentor", selector: "div.abbv-container.duopa-blue-container-1", style: "dark", blocks: ["columns-mentor"], defaultContent: [] },
      { id: "section-3", name: "Patient Stories", selector: "div.abbv-background-container.patient-story", style: null, blocks: ["hero-stories"], defaultContent: [] },
      { id: "section-4", name: "Navigation", selector: "a.duopa-button-next-page", style: null, blocks: [], defaultContent: ["a.duopa-button-next-page"] },
      { id: "section-5", name: "Safety Information", selector: "div.abbv-inline-use-isi", style: null, blocks: [], defaultContent: ["div.abbv-inline-use-isi"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_duopa_homepage_default = {
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
            console.error(`Failed to parse ${block.name}:`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        "/duopa" + (new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index")
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
  return __toCommonJS(import_duopa_homepage_exports);
})();
