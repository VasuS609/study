import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader } from "lucide-react";

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  
  // Check support during initialization, not in effect
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = !!SpeechRecognition;

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!supported) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (e) => {
      let finalText = "";
      let interim = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        let t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
        else interim += t;
      }

      let combined = finalText || interim;
      setText(combined);

      if (finalText.trim() && onTranscript) {
        onTranscript(finalText.trim());
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      console.log("Speech error:", e.error);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript]);

  const toggle = () => {
    if (!supported) {
      alert("Speech recognition not supported");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setText("");
      recognitionRef.current.start();
    }
  };

  return (
    <div className="voice-input-container flex flex-col items-center gap-2">
      <button
        onClick={toggle}
        className={`voice-button p-3 rounded-full transition-all ${
          isListening 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white shadow-lg`}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {isListening && (
        <div className="listening-indicator flex items-center gap-2 text-sm text-gray-600 animate-pulse">
          <Loader size={14} className="animate-spin" /> Listening...
        </div>
      )}

      {!isListening && text && (
        <div className="transcript-preview text-sm text-gray-500 max-w-md text-center p-2 bg-gray-50 rounded-lg">
          {text}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;