import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CharacterCard = () => {
  const [selectedId, setSelectedId] = useState(null);

  const characters = [
    { 
      id: 1, 
      name: "Emma", 
      avatar: "/api/placeholder/100/100", 
      bio: "A passionate teacher with a love for books.",
      bgColor: "bg-sky-100" 
    },
    { 
      id: 2, 
      name: "Sarah", 
      avatar: "/api/placeholder/100/100", 
      bio: "An aspiring artist who dreams big.",
      bgColor: "bg-rose-100"
    },
    { 
      id: 3, 
      name: "Michael", 
      avatar: "/api/placeholder/100/100", 
      bio: "A tech enthusiast and coffee lover.",
      bgColor: "bg-amber-100"
    },
    { 
      id: 4, 
      name: "Diana", 
      avatar: "/api/placeholder/100/100", 
      bio: "A dedicated researcher in marine biology.",
      bgColor: "bg-violet-100"
    },
    { 
      id: 5, 
      name: "Alex", 
      avatar: "/api/placeholder/100/100", 
      bio: "A chef who travels the world for inspiration.",
      bgColor: "bg-rose-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 relative">
          {characters.map((character) => (
            <motion.div
              key={character.id}
              layoutId={`card-${character.id}`}
              className={`relative ${selectedId === character.id ? 'z-50' : 'z-0'}`}
            >
              <motion.div
                className={`
                  ${character.bgColor} 
                  rounded-2xl 
                  cursor-pointer 
                  transition-shadow 
                  hover:shadow-lg
                  ${selectedId === character.id ? 
                    'fixed top-0 left-0 right-0 bottom-0 m-auto w-[90vw] h-[80vh] md:w-[60vw] md:h-[70vh] z-50' : 
                    'w-full aspect-square'
                  }
                `}
                onClick={() => setSelectedId(selectedId === character.id ? null : character.id)}
                layout
              >
                {selectedId === character.id ? (
                  // Expanded view
                  <motion.div 
                    className="h-full w-full p-6 flex flex-col md:flex-row items-center justify-center gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="md:w-1/2 flex flex-col items-center">
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-lg"
                      />
                      <h2 className="text-2xl md:text-3xl font-bold mt-4">{character.name}</h2>
                    </div>
                    <div className="md:w-1/2 flex flex-col items-center md:items-start gap-4">
                      <p className="text-lg text-center md:text-left">{character.bio}</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/30 backdrop-blur-sm hover:bg-white/40 text-gray-800 py-3 px-6 rounded-lg transition-colors mt-4"
                      >
                        Start Roleplay
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  // Grid view
                  <motion.div 
                    className="h-full w-full flex flex-col items-center justify-center p-4"
                    layout
                  >
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-16 h-16 rounded-full mb-2"
                    />
                    <p className="text-sm font-medium text-center">{character.name}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharacterCard;