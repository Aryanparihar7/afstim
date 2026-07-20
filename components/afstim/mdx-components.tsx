import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-8 text-[24px] font-medium tracking-[-0.01em] text-text" {...props} />
  ),
  h3: (props) => <h3 className="mt-6 text-[15px] font-medium text-text" {...props} />,
  p: (props) => <p className="text-[15px] leading-[1.65] text-muted" {...props} />,
  ul: (props) => (
    <ul className="list-disc space-y-2 pl-5 text-[15px] leading-[1.65] text-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-[1.65] text-muted" {...props} />
  ),
  code: (props) => <code className="font-mono text-[13px] text-text" {...props} />,
  pre: (props) => (
    <pre
      className="overflow-x-auto rounded-md border border-border bg-surface p-4 font-mono text-[13px] text-text"
      {...props}
    />
  ),
  a: (props) => <a className="text-text underline hover:text-muted" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-l-border-strong pl-4 text-muted" {...props} />
  ),
};
