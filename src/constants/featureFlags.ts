export const FEATURE_FLAGS = {
  DARK_MODE: 'dark_mode',
  NEW_CHECKOUT: 'new_checkout',
  BETA_FEATURES: 'beta_features',
  EXPERIMENTAL_UI: 'experimental_ui',
} as const;

export type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlag, boolean> = {
  [FEATURE_FLAGS.DARK_MODE]: true,
  [FEATURE_FLAGS.NEW_CHECKOUT]: false,
  [FEATURE_FLAGS.BETA_FEATURES]: false,
  [FEATURE_FLAGS.EXPERIMENTAL_UI]: false,
};
