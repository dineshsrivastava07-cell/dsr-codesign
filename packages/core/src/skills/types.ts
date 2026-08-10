// Canonical definitions live in @dsr-codesign/shared to avoid a
// circular dependency: packages/providers needs LoadedSkill but
// packages/providers is already a dependency of packages/core.
// Re-export here so skill-internal code can import from './types.js'.

export type { LoadedSkill } from '@dsr-codesign/shared';
export { SkillFrontmatterV1 } from '@dsr-codesign/shared';
