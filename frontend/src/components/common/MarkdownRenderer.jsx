// src/components/common/MarkdownRenderer.jsx
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose prose-sm max-w-none"
      components={{
        // Code blocks
        code({ node, inline, className, children, ...props }) {
          return inline ? (
            <code 
              className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800 dark:text-slate-200" 
              {...props}
            >
              {children}
            </code>
          ) : (
            <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-lg overflow-x-auto my-3 border border-slate-700">
              <code className="text-sm text-slate-100 font-mono" {...props}>
                {children}
              </code>
            </pre>
          );
        },
        // Links
        a({ node, children, ...props }) {
          return (
            <a 
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props}
            >
              {children}
            </a>
          );
        },
        // Paragraphs
        p({ node, children, ...props }) {
          return <p className="text-sm leading-relaxed mb-3 last:mb-0" {...props}>{children}</p>;
        },
        // Lists
        ul({ node, children, ...props }) {
          return <ul className="list-disc list-inside space-y-1.5 ml-2 my-3" {...props}>{children}</ul>;
        },
        ol({ node, children, ...props }) {
          return <ol className="list-decimal list-inside space-y-1.5 ml-2 my-3" {...props}>{children}</ol>;
        },
        li({ node, children, ...props }) {
          return <li className="text-sm leading-relaxed" {...props}>{children}</li>;
        },
        // Headings
        h1({ node, children, ...props }) {
          return <h1 className="text-xl font-bold mt-4 mb-2" {...props}>{children}</h1>;
        },
        h2({ node, children, ...props }) {
          return <h2 className="text-lg font-bold mt-3 mb-2" {...props}>{children}</h2>;
        },
        h3({ node, children, ...props }) {
          return <h3 className="text-base font-semibold mt-2 mb-1" {...props}>{children}</h3>;
        },
        // Blockquotes
        blockquote({ node, children, ...props }) {
          return (
            <blockquote 
              className="border-l-4 border-cyan-500 pl-4 py-2 my-3 italic bg-slate-50 dark:bg-slate-800/50" 
              {...props}
            >
              {children}
            </blockquote>
          );
        },
        // Strong/Bold
        strong({ node, children, ...props }) {
          return <strong className="font-semibold text-slate-900 dark:text-white" {...props}>{children}</strong>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
