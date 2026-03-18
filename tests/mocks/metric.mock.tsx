import { MockedImage } from "./image.mock";

interface Props {
  imageUrl: string;
  alt: string;
  value: number;
  title: string;
  textStyles?: string;
}

const MockMetric = ({ imageUrl, alt, value, title, textStyles }: Props) => {
  return (
    <div className={textStyles}>
      <MockedImage src={imageUrl} alt={alt} />
      {value} {title}
    </div>
  );
};

export { MockMetric };
