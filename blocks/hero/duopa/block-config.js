import { decorateBlock } from '../hero.js';

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [
      { variation: 'stories' },
    ],
    decorations: {
      decorate: async (ctx, blockConfig) => decorateBlock(ctx, blockConfig),
    },
  };
}
