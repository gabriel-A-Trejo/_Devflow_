const MockedImage = ({ src, alt }: { src?: string; alt: string }) => {
  // biome-ignore lint/performance/noImgElement: <explanation>
  return <img src={src} alt={alt} />;
};

export { MockedImage };
