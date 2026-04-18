/* eslint-disable */
/* global WebImporter */

const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[id*="onetrust"]',
      '.abbv-dimmer',
      '.abbv-safety-bar',
      '.abbv-sticky-right-container',
      '.abbv-back-to-top',
    ]);
  }

  if (hookName === H.after) {
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.header-v2',
      'footer',
      '.abbv-footer',
      '.abbv-references',
      '.abbv-skip-to-main-content',
      'iframe',
      'link',
      'noscript',
    ]);

    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
    });
  }
}
