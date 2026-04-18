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

  // tools/importer/import-quliptahcp-patient-stories.js
  var import_quliptahcp_patient_stories_exports = {};
  __export(import_quliptahcp_patient_stories_exports, {
    default: () => import_quliptahcp_patient_stories_default
  });

  // tools/importer/parsers/carousel-patient-stories.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".owl-item:not(.cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const photo = slide.querySelector(".abbv-image-content-container-v2 img, .patient-photo img");
      const nameEl = slide.querySelector(".patient--title p:first-child");
      const subtitleEl = slide.querySelector(".patient--title p:nth-child(2)");
      const bioList = slide.querySelector(".patient--title + ul, .patient-bio ul");
      const beforeTitle = slide.querySelector(".violator-content--bg-white .abbv-rich-text p:first-child");
      const beforeQuote = slide.querySelector(".violator-content--bg-white .abbv-rich-text p:nth-child(2)");
      const beforeList = slide.querySelector(".violator-content--bg-white ul");
      const afterSection = slide.querySelector(".violator-content--background, .violator-title--top-left-curve");
      const afterTitle = afterSection == null ? void 0 : afterSection.querySelector("p:first-child");
      const afterQuote = afterSection == null ? void 0 : afterSection.querySelector("p:nth-child(2)");
      const afterList = afterSection == null ? void 0 : afterSection.querySelector("ul");
      const afterLinks = afterSection == null ? void 0 : afterSection.querySelectorAll("a");
      const disclaimer = slide.querySelector(".disclaimer p, .patient-disclaimer p");
      const contentCell = document.createElement("div");
      if (nameEl) {
        const h3 = document.createElement("h3");
        h3.textContent = nameEl.textContent.trim();
        contentCell.appendChild(h3);
      }
      if (subtitleEl) {
        const sub = document.createElement("p");
        sub.innerHTML = `<em>${subtitleEl.textContent.trim()}</em>`;
        contentCell.appendChild(sub);
      }
      if (bioList) contentCell.appendChild(bioList.cloneNode(true));
      if (beforeTitle) {
        const bh = document.createElement("h4");
        bh.textContent = beforeTitle.textContent.trim();
        contentCell.appendChild(bh);
      }
      if (beforeQuote) {
        const bq = document.createElement("p");
        bq.innerHTML = `<strong>${beforeQuote.textContent.trim()}</strong>`;
        contentCell.appendChild(bq);
      }
      if (beforeList) contentCell.appendChild(beforeList.cloneNode(true));
      if (afterTitle) {
        const ah = document.createElement("h4");
        ah.textContent = afterTitle.textContent.trim();
        contentCell.appendChild(ah);
      }
      if (afterQuote) {
        const aq = document.createElement("p");
        aq.innerHTML = `<strong>${afterQuote.textContent.trim()}</strong>`;
        contentCell.appendChild(aq);
      }
      if (afterList) contentCell.appendChild(afterList.cloneNode(true));
      if (afterLinks) {
        afterLinks.forEach((link) => {
          const p = document.createElement("p");
          p.appendChild(link.cloneNode(true));
          contentCell.appendChild(p);
        });
      }
      if (disclaimer) contentCell.appendChild(disclaimer.cloneNode(true));
      cells.push([photo || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/quliptahcp-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[id*="onetrust"]',
        ".abbv-dimmer",
        ".abbv-safety-bar",
        ".abbv-sticky-right-container",
        ".abbv-back-to-top"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        ".header-v2",
        "footer",
        ".abbv-footer",
        ".abbv-references",
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

  // tools/importer/import-quliptahcp-patient-stories.js
  var parsers = {
    "carousel": parse
  };
  var PAGE_TEMPLATE = {
    name: "quliptahcp-patient-stories",
    description: "QULIPTA HCP patient stories page with carousel of patient testimonials",
    urls: ["https://www.quliptahcp.com/patient-stories"],
    blocks: [
      { name: "carousel", instances: ["div.carousel-patient-stories"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: ".violator-title", style: null, blocks: [], defaultContent: [".violator-title h1"] },
      { id: "section-2", name: "Patient Stories", selector: "div.carousel-patient-stories", style: null, blocks: ["carousel"], defaultContent: [] },
      { id: "section-3", name: "CTA", selector: "a.qulipta-bottom-cta", style: null, blocks: [], defaultContent: ["a.qulipta-bottom-cta"] },
      { id: "section-4", name: "Safety Info", selector: ".abbv-inline-use-isi", style: null, blocks: [], defaultContent: [".abbv-inline-use-isi"] }
    ]
  };
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed:`, e);
      }
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
  var import_quliptahcp_patient_stories_default = {
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
        "/quliptahcp" + new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_quliptahcp_patient_stories_exports);
})();
