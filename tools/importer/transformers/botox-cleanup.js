/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: botox.com cleanup.
 * Selectors from captured DOM of https://www.botox.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent, tracking pixels, recaptcha, promo drawers
    // Found in captured DOM: #onetrust-consent-sdk, .g-recaptcha, .promo-drawer, .ghost
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[id*="onetrust"]',
      '.g-recaptcha',
      '.promo-drawer',
      '.ghost',
      '.abbv-badgeless-captcha',
      '[class*="loading"]',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, navigation, skip links
    // Found in captured DOM: header.abbv-header-v2, footer.abbv-footer, .abbv-skip-to-main-content
    WebImporter.DOMUtils.remove(element, [
      'header.abbv-header-v2',
      '.header-v2',
      'footer.abbv-footer',
      '.footer-container',
      '.abbv-skip-to-main-content',
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp');
    });
  }
}
