import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { MdSend } from 'react-icons/md';
import Filter from 'bad-words';
import { davinci } from '../utils/davinci';
import { dalle } from '../utils/dalle';
import Modal from './Modal';
import Setting from './Setting';
import {im1o} from "../utils/IM.io";

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const options = ['IM.1o'];
  const [selected, setSelected] = useState(options[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
    };

    addMessage(newMsg);
  };

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();

    // const key = window.localStorage.getItem('api-key');
    // if (!key) {
    //   setModalOpen(true);
    //   return;
    // }

    const filter = new Filter();
    const cleanPrompt = filter.isProfane(formValue)
      ? filter.clean(formValue)
      : formValue;

    const newMsg = cleanPrompt;
    const aiModel = selected;

    setThinking(true);
    setFormValue('');
    updateMessage(newMsg, false, aiModel);

    console.log(selected);
    try {
      if (aiModel === options[0]) {
        const data = await im1o(cleanPrompt);
        console.log(data)
        data && updateMessage(data, true, aiModel);
      } else {
        const response = await dalle(cleanPrompt);
        const data = response.data.data[0].url;
        data && updateMessage(data, true, aiModel);
      }
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
    }

    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // 👇 Get input value
      sendMessage(e);
    }
  };

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className='chatview'>
      <main className='chatview__chatarea'>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </main>
      <div className="">
        <form className="form w-3/4 mx-auto mt-4 p-4 rounded-lg" onSubmit={sendMessage}>
          <div>
            <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="selectModel bg-white dropdown w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>{options[0]}</option>
              <option>{options[1]}</option>
            </select>
          </div>

          <div className="relative w-full flex items-center">
            <textarea
                ref={inputRef}
                className="chatview__textarea-message bg-white w-full p-4 pr-12 border-2 border-gray-300 rounded-lg focus:shadow-none resize-none"
                value={formValue}
                onKeyDown={handleKeyDown}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="Type a message..."
            />

            <button
                type="submit"
                className="absolute right-2 bottom-4 text-white p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                disabled={!formValue}>
              <MdSend size={20} />
            </button>
          </div>
        </form>
      </div>

      {/*<Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>*/}
      {/*  <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />*/}
      {/*</Modal>*/}
    </div>
  );
};

export default ChatView;
