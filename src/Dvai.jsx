import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';


export default function Component() {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! How can I assist you today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
//   dskjlhvsoeh

// State hooks for storing the question and answer
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

// Function to structure and beautify the API response text
function structureText(text) {
  // Example: Split text into paragraphs based on double newline characters
  let structuredText = text.split('\n\n').map(paragraph => {
    // Trim and capitalize each paragraph
    return paragraph.trim().replace(/(^\s\w|[\.\!\?]\s*\w)/g, function (c) { return c.toUpperCase(); });
  }).join('\n\n'); // Join the paragraphs back with double newlines

  // Additional formatting if needed (e.g., convert to list, add bullet points, etc.)
  return structuredText.trim();
}

// Function to generate answer using the Gemini API
async function generateAnswer() {
  console.log("Loading...");

  try {
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCo6p1QXJmIFD5g5nbEhxRDnxI5yfyC-74",
      method: "post",
      data: {
        contents: [
          {
            parts: [{ "text": question }]
          }
        ]
      }
    });

    // Extract the raw response text
    const rawAnswer = response.data.candidates[0].content.parts[0].text;

    // Structure and beautify the response text
    const structuredAnswer = structureText(rawAnswer);

    // Set the structured answer in the state
    setAnswer(structuredAnswer);
    console.log(structuredAnswer);
  } catch (error) {
    console.error("Error generating answer:", error);
    setAnswer("An error occurred while generating the answer. Please try again.");
  }
}


  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newUserMessage = { id: Date.now().toString(), text: inputText, isUser: true };
      setMessages(prev => [...prev, newUserMessage]);
      setInputText('');
      // Simulate AI response
      setTimeout(() => {
        const newAIMessage = { 
          id: (Date.now() + 1).toString(), 
          text: "This is a simulated response. I'm here to help you with any questions or tasks you might have.", 
          isUser: false 
        };
        setMessages(prev => [...prev, newAIMessage]);
      }, 1000);
    }
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              DV AI Chat
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    maxWidth: '100%',
                    p: 2,
                    bgcolor: message.isUser ? 'primary.main' : 'background.paper',
                    color: message.isUser ? 'primary.contrastText' : 'text.primary',
                  }}
                  role={message.isUser ? "log" : "status"}
                  aria-live={message.isUser ? "off" : "polite"}
                >
                  <Typography mb={3} sx={{backgroundColor:"#8EBBE8",width:'auto',color:"#ffffff",padding:'10px',fontSize:'25px',borderRadius:'7px'}} >{question}</Typography>
                  <Typography component="pre" style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: '16px', borderRadius: '8px' }}>{answer}</Typography>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Box>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={question} onChange={(e) => setQuestion(e.target.value)} 
            //   value={inputText}
            //   onChange={(e) => setInputText(e.target.value)}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={generateAnswer} color="primary" type="submit" aria-label="Send message">
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}