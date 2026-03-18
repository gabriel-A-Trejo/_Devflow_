const MockEditorMethods = {
  getMarkdown: jest.fn(() => ""),
  setMarkdown: jest.fn(),
  focus: jest.fn(),
};

const MockEditor = jest.fn(
  ({ id, value, editorRef, fieldChange, ...props }) => {
    if (editorRef) {
      editorRef.current = {
        setMarkdown: jest.fn((markdown: string) => {
          fieldChange(markdown);
        }),
        getMarkdown: jest.fn(() => value),
      };
    }

    return (
      <textarea
        id={id}
        data-testid="mdx-editor"
        value={value}
        onChange={(e) => fieldChange(e.target.value)}
        placeholder="MDXEditor Mock"
        {...props}
      />
    );
  },
);

export { MockEditor, MockEditorMethods };
