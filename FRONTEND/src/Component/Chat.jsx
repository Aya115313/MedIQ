import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export default function Chat({ onBackClick }) {
   const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showDoctorPanel, setShowDoctorPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('media');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`File selected: ${file.name}`);
      // You can add file upload logic here
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const userMessage = { text: input, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      setTimeout(() => {
        const botMessage = { text: "Hello Mr.name, how can I assist you?", sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const toggleDoctorPanel = () => {
    setShowDoctorPanel(!showDoctorPanel);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ 
      height: "100vh",
      width: "100%",
      backgroundImage: "url('/picture/fgcahg(4).png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Main Chat Area (LEFT SIDE) */}
      <div style={{ 
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: showDoctorPanel ? "calc(100% - 300px)" : "100%",
        transition: "width 0.3s",
      }}>
        {/* Chat Header */}
        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          backdropFilter: "blur(5px)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          background: "rgba(255, 255, 255, 0.7)"
        }}>
          {/* Left Side */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
           
            <button 
               onClick={() => navigate('/')}  
              style={{
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <img 
                src="/picture/Vector@2x.png" 
                alt="Close"
                style={{
                  width: '24px',
                  height: '24px',
                  marginTop: "-70px",
                  marginLeft: "-10px",
                }}
              />
            </button>
            
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                cursor: "pointer"
              }}
              onClick={toggleDoctorPanel}
            >
              <img 
                src="/picture/OIP (2).png" 
                alt="Doctor" 
                style={{ 
                  
                  height: "40px", 
                  width: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ddd"
                }} 
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>Dr. G</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>Online</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div style={{ display: "flex", gap: "15px" }}>
            <button 
              onClick={() => alert("Voice call initiated")}
              style={{ 
                border: "none", 
                background: "none", 
                cursor: "pointer",
                padding: "5px"
              }}
            >
              <img 
                src="/picture/Phone.png" 
                alt="Voice Call" 
                style={{ height: "34px" }} 
              />
            </button>
            <button 
              onClick={() => alert("Video call initiated")}
              style={{ 
                border: "none", 
                background: "none", 
                cursor: "pointer",
                padding: "5px"
              }}
            >
              <img 
                src="/picture/Duo.png" 
                alt="Video Call" 
                style={{ height: "34px" }} 
              />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ 
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          height: "100%",
          background: "rgba(255, 255, 255, 0.5)"
        }}>
          {/* Messages rendering */}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "10px",
                marginBottom: "15px",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
              }}
            >
              <img
                src={
                  msg.sender === "user"
                    ? "/picture/Profile.png"
                    : "/picture/doctor.png"
                }
                alt={msg.sender}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "60%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  backgroundColor: msg.sender === "user" 
                    ? "rgba(21, 172, 206, 0.2)" 
                    : "rgba(255, 255, 255, 0.9)",
                  color: "black",
                  padding: "10px 15px",
                  borderRadius: msg.sender === "user" 
                    ? "18px 18px 0 18px" 
                    : "18px 18px 18px 0",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area with File Upload */}
        <div style={{ 
          padding: "15px",
          borderTop: "1px solid rgba(221, 221, 221, 0.7)",
          background: "rgba(255, 255, 255, 0.7)"
        }}>
          <div style={{ 
            display: "flex", 
            border: "1px solid rgba(204, 204, 204, 0.7)", 
            borderRadius: "25px",
            overflow: "hidden",
            height: "50px",
            background: "white"
          }}>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            
            {/* File upload button */}
            <button
              onClick={triggerFileInput}
              style={{
                width: "50px",
                border: "none",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <img 
                src="/picture/Attach.png" 
                alt="Attach file" 
                style={{ width: "24px", height: "24px" }} 
              />
            </button>
            
            {/* Message input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message here..."
              style={{
                flex: 1,
                padding: "0 20px",
                fontSize: "16px",
                border: "none",
                outline: "none",
                height: "100%",
                background: "white"
              }}
            />
            
            {/* Send button */}
            <button
              onClick={sendMessage}
              style={{
                width: "60px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                backgroundColor: "white"
              }}
            >
              <img 
                src="/picture/Paper Plane.png" 
                alt="Send" 
                style={{ width: "30px", height: "30px" }} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Information Panel (RIGHT SIDE) */}
      {showDoctorPanel && (
        <div style={{
          width: "300px",
          backgroundColor: "rgba(248, 249, 250, 0.95)",
          borderLeft: "1px solid rgba(221, 221, 221, 0.7)",
          padding: "0px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflowY: "auto",
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
         
          boxShadow: "-2px 0 5px rgba(0,0,0,0.1)"
        }}>
          {/* Doctor Profile Box */}
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderRadius: "10px",
            padding: "50px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
           
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              paddingBottom: '30px',
            }}>
              <button 
                onClick={toggleDoctorPanel}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: "1px 1px",
                  cursor: 'pointer'
                }}
              >
                <img 
                  src="/picture/Back.png" 
                  style={{
                    width: '30px',
                    height: '30px',
                    marginTop:"-70px",
                    marginLeft:"-30px",

                   
                  }}
                />
              </button>
              
              <button 
                onClick={toggleDoctorPanel}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                <img 
                  src="/picture/Vector@2x.png" 
                  alt="Close"
                  style={{
                    width: '24px',
                    height: '24px',
                    marginTop:"-70px",
                    marginLeft:"-30px",

                  }}
                />
              </button>
            </div>
            
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <img 
                src="/picture/OIP (2).png" 
                alt="Doctor" 
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #e3f2fd",
                  marginLeft:"-130px"
                }} 
              />
              <h5 style={{ margin: 0, color: "#333" }}>Dr. G</h5>
            </div>
          </div>

          {/* Contact Information Box */}
          <div style={{
            backgroundImage: "url('/picture/Rectangle 143 (2).png')",
            backgroundSize: "cover",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            color: "white",
            height: "300px",

          }}>
            <h4 style={{ marginTop: 0, color: "rgb(21, 172, 206)" }}> Info</h4>
            <span>+213 659567809</span>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: "5px 0 15px 0" }}>Mobile</p>
            <span>dr.g@gmail.com</span>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: "5px 0 0 0" }}>Email Address</p>
          </div>

          {/* Documents & Media Box with Horizontal Header */}
          <div style={{
            backgroundImage: "url('/picture/Rectangle 143 (2).png')",
            height: "341px",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            overflow: "hidden"
          }}>
            {/* Horizontal Header Tabs */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid #eee",
              
            }}>
              <div 
                onClick={() => handleTabClick('media')}
                style={{
                  padding: "15px 20px",
                  cursor: "pointer",
                  borderBottom: activeTab === 'media' ? "3px solid rgb(21, 172, 206)" : "none",
                  color: activeTab === 'media' ? "rgb(21, 172, 206)" : "#666",
                  fontWeight: activeTab === 'media' ? "600" : "400",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  ':hover': {
                    backgroundColor: "#f5f5f5"
                  }
                }}
              >
                <span>Media</span>
              </div>
              
              <div 
                onClick={() => handleTabClick('files')}
                style={{
                  padding: "15px 20px",
                  cursor: "pointer",
                  borderBottom: activeTab === 'files' ? "3px solid rgb(21, 172, 206)" : "none",
                  color: activeTab === 'files' ? "rgb(21, 172, 206)" : "#666",
                  fontWeight: activeTab === 'files' ? "600" : "400",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  ':hover': {
                    backgroundColor: "#f5f5f5"
                  }
                }}
              >
                <span>Files</span>
              </div>
              
              <div 
                onClick={() => handleTabClick('prescriptions')}
                style={{
                  padding: "15px 20px",
                  cursor: "pointer",
                  borderBottom: activeTab === 'prescriptions' ? "3px solid rgb(21, 172, 206)" : "none",
                  color: activeTab === 'prescriptions' ? "rgb(21, 172, 206)" : "#666",
                  fontWeight: activeTab === 'prescriptions' ? "600" : "400",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  ':hover': {
                    backgroundColor: "#f5f5f5"
                  }
                }}
              >
                <span>Prescriptions</span>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ 
              padding: "20px",
              height: "calc(100% - 53px)",
              overflowY: "auto"
            }}>
              {activeTab === 'media' && (
                <div style={{ textAlign: "center", color: "#666", padding: "20px 0" }}>
                  No media shared yet
                </div>
              )}
              {activeTab === 'files' && (
                <div style={{ textAlign: "center", color: "#666", padding: "20px 0" }}>
                  No files shared yet
                </div>
              )}
              {activeTab === 'prescriptions' && (
                <div style={{ textAlign: "center", color: "#666", padding: "20px 0" }}>
                  No prescriptions shared yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}