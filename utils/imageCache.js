const imageCache = new Map();

export const cacheImage = (key, url) => {
    imageCache.set(key, url);
};

export const getCachedImage = (key) => {
    return imageCache.get(key);
};
