
/**
 * Resolves the path to a static asset, accounting for the base URL in production.
 * @param path The absolute path to the asset (e.g., "/model.glb").
 * @returns The resolved path (e.g., "/repo-name/model.glb").
 */
export const resolvePath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL;
    // Prevent double slashes if base ends with / and path starts with /
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    return `${cleanBase}${cleanPath}`;
};
