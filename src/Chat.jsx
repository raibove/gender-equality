import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useParams } from 'react-router-dom';
import { Characters } from './constants';
import Bot from './assets/Bot.svg';

const TypingIndicator = () => (
  <div className="flex space-x-2 p-3 bg-gray-100 rounded-2xl rounded-bl-none max-w-[100px]">
    <motion.div
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
    />
    <motion.div
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

const RoleplayChat = () => {
  const { id } = useParams();

  const [err, setErr] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('Hi!');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [character, setCharacter] = useState(null);

  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const handleInitialize = async () => {
    await sendMessage();
    setIsLoading(false); 
  }

  useEffect(() => {
    if (!id || id > Characters.length) {
      setErr(true);
      return;
    }
    setCharacter(Characters[id - 1])
  }, [])

  useEffect(()=>{
    handleInitialize();
  },[character])

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getHistory = () => {
    const chatHistory = messages.map(msg => ({
      role: msg.sender,
      parts: [{ text: msg.text }]
    }))

    return chatHistory;
  }

  useEffect(() => {
    const container = chatContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const desiredKeys = ["name", "age", "nationality", "location", "occupation", "familyBackground", "scenario"];

  const camelCaseToTitleCase = (str) =>{
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
      .replace(/^./, char => char.toUpperCase()); // Capitalize the first letter
  }
  
  const sendMessage = async (e) => {
    e && e.preventDefault();
    if (!newMessage.trim() || !character) return;
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const formattedString = desiredKeys
        .map((key) => {
          if (character[key] !== undefined) {
            const formattedKey = camelCaseToTitleCase(key);

            if (key === "occupation" || key === "familyBackground") {
              return `${formattedKey}: ${character[key]}\n`; // Add extra newline after these keys
            }
            return `${formattedKey}: ${character[key]}`;
          }
          return null;
        })
        .filter(line => line !== null) // Remove any null values (for missing keys)
        .join('\n');

      const response = await fetch('http://127.0.0.1:8787', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputPrompt: newMessage,
          history: getHistory(),
          userStory: formattedString,
          user: character.name
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const responseText = await response.text();

      // Add AI response
      setMessages(prev => [...prev, {
        id: Math.random(),
        sender: 'model',
        text: responseText.replace(/\n/gi, '\n &nbsp;'),
        timestamp: new Date().toISOString(),
        isComplete: true
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Math.random(),
        sender: 'model',
        text: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
        isComplete: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return <></>
  }

  if (err) {
    return <>Faced some issue, please navigate to home page</>
  }

  return (
    <div className="h-screen max-h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <motion.div
        className={`${character.bgColor} p-4 flex items-center gap-4 shadow-sm`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <img
          src={character.avatar}
          alt={character.name}
          className="w-12 h-12 rounded-full"
        />
        <h2 className="text-lg font-semibold">{character.name}</h2>
      </motion.div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2 items-end`}
            >
              {message.sender === 'model' && (
                <img
                  src={Bot}
                  alt='bot'
                  className="w-8 h-8 rounded-full"
                />
              )}
              <motion.div
                className={`
                  max-w-[70%] p-3 rounded-2xl
                  ${message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : `${character.bgColor} rounded-bl-none`
                  }
                `}
                whileHover={{ scale: 1.02 }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                >{message.text}</ReactMarkdown>

                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </motion.div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 items-end"
            >
              <img
                src={character.avatar}
                alt={character.name}
                className="w-8 h-8 rounded-full"
              />
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-8 p-2 bg-white rounded-full shadow-lg"
          >
            <p>Scroll</p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <motion.form
        onSubmit={sendMessage}
        className={`${character.bgColor} p-4 gap-4 flex items-end shadow-lg`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex-1">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          {/* <Send className="w-5 h-5" /> */}
          <p>Send</p>
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RoleplayChat;