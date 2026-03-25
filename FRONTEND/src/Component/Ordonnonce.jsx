import React from "react";
import { saveAs } from 'file-saver';

function DownloadAllInOneRow() {
  const ordonnanceContent = "This is the ordonnance content...";
  const email = "example@gmail.com";
  const phoneNumber = "+1234567890";

  const handleDownloadOrdonnance = () => {
    const blob = new Blob([ordonnanceContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'ordonnance.txt');
  };

  const handleDownloadEmail = () => {
    const content = `Email: ${email}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'email.txt');
  };

  const handleDownloadPhoneNumber = () => {
    const content = `Phone Number: ${phoneNumber}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'phone_number.txt');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '100%',
        margin: '20px auto',
      }}
    >
      <button
        onClick={handleDownloadOrdonnance}
        style={{
          border: 'none',
          backgroundColor: 'white',
          color: 'black',
          padding: '3px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
          
        }}
      >
        Ordonnance
      </button>

      <div
        onClick={handleDownloadEmail}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginLeft: "380px",
          fontWeight: "bold",
        }}
      >
        <img src="picture/mail.png" alt="mail" style={{ width: '20px', height: '20px' }} />
        <span>Exempl@gmail.com</span>
      </div>

      <div
        onClick={handleDownloadPhoneNumber}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginLeft: "350px",
          fontWeight: "bold",
        }}
      >
        <img src="picture/telephone.png" alt="telephone" style={{ width: '20px', height: '20px' }} />
        <span>0658572041</span>
      </div>
    </div>
  );
}

export default DownloadAllInOneRow;
