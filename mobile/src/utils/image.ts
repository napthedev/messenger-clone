export const imageProxy = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

export const imageProxyPlus = (
  url: string,
  width: number,
  height: number,
  fit: string
) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(
    url
  )}&w=${width}&h=${height}&fit=${fit}`;
