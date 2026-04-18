import { decorateBlock } from '../columns.js';

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [
      { variation: 'mentor' },
    ],
    decorations: {
      decorate: async (ctx, blockConfig) => decorateBlock(ctx, blockConfig),
    },
  };
}
