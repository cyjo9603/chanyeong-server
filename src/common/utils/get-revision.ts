export const getRevision = () =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require?.('child_process')?.execSync?.('git rev-parse HEAD')?.toString?.().trim?.();
