import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Send, ChevronDown } from 'lucide-react';

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

const RoleplayChat = ({ character = {
  id: 1,
  name: "Emma",
  avatar: "/api/placeholder/100/100",
  bgColor: "bg-sky-100",
} }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'character',
      text: "Hi! I'm Emma, a teacher who loves books. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

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

  useEffect(() => {
    const container = chatContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const splitIntoChunks = (text, maxLength = 150) => {
    const words = text.split(' ');
    const chunks = [];
    let currentChunk = '';

    words.forEach(word => {
      if ((currentChunk + ' ' + word).length <= maxLength) {
        currentChunk += (currentChunk ? ' ' : '') + word;
      } else {
        chunks.push(currentChunk);
        currentChunk = word;
      }
    });
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  };

  const addMessageChunk = async (chunk, messageId, isLastChunk) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setMessages(prev => {
          const existingMessageIndex = prev.findIndex(m => m.id === messageId);
          
          if (existingMessageIndex === -1) {
            // Add new message
            return [...prev, {
              id: messageId,
              sender: 'character',
              text: chunk,
              timestamp: new Date().toISOString(),
              isComplete: isLastChunk
            }];
          } else {
            // Update existing message
            return prev.map(m => 
              m.id === messageId 
                ? { ...m, text: m.text + ' ' + chunk, isComplete: isLastChunk }
                : m
            );
          }
        });
        resolve();
      }, Math.random() * 500 + 500); // Random delay between 500-1000ms
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate character response with a long message
    const response = "Let me share my thoughts on that. As a teacher, I've encountered many similar situations in my classroom. It's fascinating how different perspectives can contribute to our understanding. I believe we can explore this topic further and discover new insights together. What aspects would you like to discuss in more detail?";
    

    const resp = await fetch(' http://127.0.0.1:8787', {
        method:'POST',
        body: JSON.stringify({
            inputPrompt: 'Hi'
        })
    })

    console.log(resp.body)

    setMessages(prev => {
          return [...prev, {
            id: messages.length + 2,
            sender: 'character',
            text: response,
            timestamp: new Date().toISOString(),
            isComplete: true
          }];

      });
    // const chunks = splitIntoChunks(response);
    // const responseMessageId = messages.length + 2;

    // Add chunks with delays
    // for (let i = 0; i < chunks.length; i++) {
    //   await addMessageChunk(chunks[i], responseMessageId, i === chunks.length - 1);
    // }

    setIsTyping(false);
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
              {message.sender === 'character' && (
                <img 
                  src={character.avatar} 
                  alt={character.name}
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
                <p>{message.text}</p>
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