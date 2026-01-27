import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const Preview = ({ content = "" }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");
  return (
    <section className="markdown prose grid break-word ">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code {...props} lineNumbers className="scrollbar-hidden" />
          ),
        }}
      />
    </section>
  );
};

export default Preview;
