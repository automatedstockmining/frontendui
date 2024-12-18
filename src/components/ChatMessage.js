import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import moment from 'moment';
import Image from './Image';
import logo from "../assets/high_res_logo.png";

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
  const { id, createdAt, text, ai = false, selected } = props.message;

  // Inline table styles
  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '16px 0',
    fontSize: '14px',
    color: '#333',
  };

  const cellStyles = {
    border: '2px solid #333', // Strong solid border
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#000',
    color: '#fff', // White text
  };
  
  const headerStyles = {
    border: '2px solid #333', // Solid border
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#000', // Black background
    color: '#fff',           // White text
    fontWeight: 'bold',
  };

  return (
    <div
      key={id}
      className={`${ai && 'flex-row-reverse bg-light-white'} message`}>
      {selected === 'DALL·E' && ai ? (
        <Image url={text} />
      ) : (
        <div className='message__wrapper'>
          <ReactMarkdown
            className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || 'language-js');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag='div'
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              table: ({ node, ...props }) => (
                <table style={tableStyles} {...props}>
                  {props.children}
                </table>
              ),
              th: ({ node, ...props }) => (
                <th style={headerStyles} {...props}>
                  {props.children}
                </th>
              ),
              td: ({ node, ...props }) => (
                <td style={cellStyles} {...props}>
                  {props.children}
                </td>
              ),
            }}
          >
            {text}
          </ReactMarkdown>

          <div
            className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>
            {moment(createdAt).calendar()}
          </div>
        </div>
      )}

      {ai ? (
        <div className='message__pic__bot'>
          <span className='w-16 h-16'>
            <img src={logo} alt='' />
          </span>
        </div>
      ) : (
        <div className='message__pic'>
          <MdAccountCircle />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
