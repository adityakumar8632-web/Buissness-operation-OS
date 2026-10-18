/**
 * Hardened sandboxing iframe preventing external plugins from accessing top-level DOM or cookies[cite: 3].
 * Generates secure iframe attributes.
 */
export function getSandboxAttributes() {
  return {
    sandbox: "allow-scripts allow-forms allow-popups", // Specifically EXCLUDING allow-same-origin to prevent cookie access
    referrerPolicy: "no-referrer" as React.HTMLAttributeReferrerPolicy,
    loading: "lazy" as const,
  };
}