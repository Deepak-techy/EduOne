// // src/components/common/MarkdownRenderer.jsx
// import ReactMarkdown from 'react-markdown';

// const MarkdownRenderer = ({ content }) => {
//   return (
//     <div className="prose prose-sm max-w-none dark:prose-invert">
//       <ReactMarkdown
//         components={{
//           // Code blocks
//           code({ node, inline, className, children, ...props }) {
//             return inline ? (
//               <code 
//                 className="bg-cyan-100 dark:bg-cyan-900/30 px-1.5 py-0.5 rounded text-xs font-mono text-cyan-900 dark:text-cyan-200" 
//                 {...props}
//               >
//                 {children}
//               </code>
//             ) : (
//               <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-lg overflow-x-auto my-3 border border-slate-700">
//                 <code className="text-sm text-slate-100 font-mono block" {...props}>
//                   {children}
//                 </code>
//               </pre>
//             );
//           },
//           // Paragraphs
//           p({ node, children, ...props }) {
//             return <p className="text-sm leading-relaxed mb-3 last:mb-0 text-slate-800 dark:text-slate-200" {...props}>{children}</p>;
//           },
//           // Lists
//           ul({ node, children, ...props }) {
//             return <ul className="list-disc list-inside space-y-1.5 ml-2 my-3 text-slate-800 dark:text-slate-200" {...props}>{children}</ul>;
//           },
//           ol({ node, children, ...props }) {
//             return <ol className="list-decimal list-inside space-y-1.5 ml-2 my-3 text-slate-800 dark:text-slate-200" {...props}>{children}</ol>;
//           },
//           li({ node, children, ...props }) {
//             return <li className="text-sm leading-relaxed" {...props}>{children}</li>;
//           },
//           // Headings
//           h1({ node, children, ...props }) {
//             return <h1 className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white" {...props}>{children}</h1>;
//           },
//           h2({ node, children, ...props }) {
//             return <h2 className="text-lg font-bold mt-3 mb-2 text-slate-900 dark:text-white" {...props}>{children}</h2>;
//           },
//           h3({ node, children, ...props }) {
//             return <h3 className="text-base font-semibold mt-2 mb-1 text-slate-900 dark:text-white" {...props}>{children}</h3>;
//           },
//           // Strong/Bold
//           strong({ node, children, ...props }) {
//             return <strong className="font-bold text-slate-900 dark:text-white" {...props}>{children}</strong>;
//           },
//           // Emphasis/Italic
//           em({ node, children, ...props }) {
//             return <em className="italic text-slate-800 dark:text-slate-200" {...props}>{children}</em>;
//           },
//           // Blockquotes
//           blockquote({ node, children, ...props }) {
//             return (
//               <blockquote 
//                 className="border-l-4 border-cyan-500 pl-4 py-2 my-3 italic bg-cyan-50 dark:bg-cyan-900/20 text-slate-700 dark:text-slate-300" 
//                 {...props}
//               >
//                 {children}
//               </blockquote>
//             );
//           },
//         }}
//       >
//         {content}
//       </ReactMarkdown>
//     </div>
//   );
// };

// export default MarkdownRenderer;



















// src/components/common/MarkdownRenderer.jsx
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          // Code blocks
          code({ node, inline, className, children, ...props }) {
            return inline ? (
              <code 
                className="bg-cyan-100 dark:bg-cyan-900/30 px-1.5 py-0.5 rounded text-xs font-mono text-cyan-900 dark:text-cyan-200" 
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto my-3 border-2 border-slate-200 dark:border-slate-700">
                <code className="text-sm text-slate-800 dark:text-slate-200 font-mono block" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          // Paragraphs
          p({ node, children, ...props }) {
            return <p className="text-sm leading-relaxed mb-3 last:mb-0 text-slate-800 dark:text-slate-200" {...props}>{children}</p>;
          },
          // Lists
          ul({ node, children, ...props }) {
            return <ul className="list-disc list-inside space-y-1.5 ml-2 my-3 text-slate-800 dark:text-slate-200" {...props}>{children}</ul>;
          },
          ol({ node, children, ...props }) {
            return <ol className="list-decimal list-inside space-y-1.5 ml-2 my-3 text-slate-800 dark:text-slate-200" {...props}>{children}</ol>;
          },
          li({ node, children, ...props }) {
            return <li className="text-sm leading-relaxed" {...props}>{children}</li>;
          },
          // Headings
          h1({ node, children, ...props }) {
            return <h1 className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white" {...props}>{children}</h1>;
          },
          h2({ node, children, ...props }) {
            return <h2 className="text-lg font-bold mt-3 mb-2 text-slate-900 dark:text-white" {...props}>{children}</h2>;
          },
          h3({ node, children, ...props }) {
            return <h3 className="text-base font-semibold mt-2 mb-1 text-slate-900 dark:text-white" {...props}>{children}</h3>;
          },
          // Strong/Bold
          strong({ node, children, ...props }) {
            return <strong className="font-bold text-slate-900 dark:text-white" {...props}>{children}</strong>;
          },
          // Emphasis/Italic
          em({ node, children, ...props }) {
            return <em className="italic text-slate-800 dark:text-slate-200" {...props}>{children}</em>;
          },
          // Blockquotes
          blockquote({ node, children, ...props }) {
            return (
              <blockquote 
                className="border-l-4 border-cyan-500 pl-4 py-2 my-3 italic bg-cyan-50 dark:bg-cyan-900/20 text-slate-700 dark:text-slate-300" 
                {...props}
              >
                {children}
              </blockquote>
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
