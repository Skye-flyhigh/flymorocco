export function extractImageDimensions(imagePath: string) {
    const regex = /-(\d+)x(\d+)\.(jpg|jpeg|png|webp)$/i;
    const match = imagePath.match(regex);

    if(!match) {
        console.warn("⚠️ Could not extract image dimensions from:", imagePath);
        return {width: 800, height: 600} // default fallback
    }

    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);

    return { width, height}
}