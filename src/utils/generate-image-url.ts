import { config } from '../config';

export const generateImageUrl = (contentUrl: string): string => (config.IMAGE_SERVER ? `/iiif/2/${contentUrl}/full/1024,/0/default.jpg` : contentUrl);
