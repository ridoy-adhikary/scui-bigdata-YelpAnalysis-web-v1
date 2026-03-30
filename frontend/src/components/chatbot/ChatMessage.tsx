import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface Message {
  id: string;
  text: string;
  sql?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, x: isBot ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div 
        className={`max-w-[82%] p-3.5 rounded-2xl shadow-sm text-sm font-body border ${
          isBot 
            ? 'bg-white text-primary-900 rounded-tl-sm border-primary-100' 
            : 'bg-yelp-red text-white rounded-tr-sm border-yelp-red/50'
        }`}
      >
        {isBot ? (
          <div className="leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                pre: ({ children }) => (
                  <pre className="my-3 overflow-x-auto rounded-lg border border-primary-200 bg-[#f6f8fa] p-3 text-xs sm:text-sm">
                    {children}
                  </pre>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return <code className="rounded bg-primary-100 px-1 py-0.5 text-[0.9em]">{children}</code>;
                  }

                  return <code className={className}>{children}</code>;
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2 rounded-lg border border-primary-100">
                    <table className="w-full border-collapse text-xs sm:text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-primary-50">{children}</thead>,
                th: ({ children }) => (
                  <th className="border-b border-primary-100 px-3 py-2 text-left font-semibold text-primary-900">{children}</th>
                ),
                td: ({ children }) => <td className="border-b border-primary-100 px-3 py-2 align-top">{children}</td>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-700 underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>

            {message.sql && (
              <div className="mt-3 rounded-lg border border-primary-200 bg-primary-50/40 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-700">Generated SQL</p>
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: ({ children }) => (
                      <pre className="my-0 overflow-x-auto rounded-md border border-primary-200 bg-[#f6f8fa] p-3 text-xs sm:text-sm">
                        {children}
                      </pre>
                    ),
                    code: ({ children, className }) => <code className={className}>{children}</code>,
                  }}
                >
                  {`\`\`\`sql\n${message.sql}\n\`\`\``}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ) : (
          <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
        )}
        <span className={`text-[10px] mt-1.5 block opacity-70 ${isBot ? 'text-primary-700' : 'text-white'}`}>
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;