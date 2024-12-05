'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [gradient, setGradient] = useState('');
  const [showInfo, setShowInfo] = useState(false); // For the info modal

  useEffect(() => {
    // Generate two random light colors
    const randomColor = () =>
      `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(
        Math.random() * 40 + 60
      )}%, ${Math.floor(Math.random() * 30 + 70)}%)`;

    const color1 = randomColor();
    const color2 = randomColor();

    setGradient(`linear-gradient(135deg, ${color1}, ${color2})`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!res.ok) throw new Error('Failed to fetch response');

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
      setResponse('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: gradient,
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        position: 'relative', // Allows the floating button to stay positioned
        overflow: 'hidden',
        transition: 'background 0.5s ease-in-out',
      }}
    >
      {/* Floating Info Button */}
      <div
        onClick={() => setShowInfo(true)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          animation: 'bounce 2s infinite',
        }}
        title="Click for info"
      >
        ℹ️
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div
          style={{
            color: 'black',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '400px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '10px' }}><b>Note from the Creator</b></h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
          We&apos;re living in an era of depression and burnout, where tasks just seem never-ending and, for many, motivation is at an all time low. Rise and Roast started as a joke of a project to roast myself into being productive rather than lazing around in bed. Humor keep things playful and avoids being mean, while also giving a little nudge in the right direction. Enjoy!
          </p>
          <p>-Joy</p>
          <button
  onClick={() => setShowInfo(false)}
  style={{
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ff6f61',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }}
  onMouseOver={(e) =>
    ((e.target as HTMLButtonElement).style.backgroundColor = '#ff886f')
  }
  onMouseOut={(e) =>
    ((e.target as HTMLButtonElement).style.backgroundColor = '#ff6f61')
  }
>
  Close
</button>



        </div>
      )}

      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        Rise and Roast
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <input
          type="text"
          placeholder="What are you doing?"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{
            color: 'black',
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '2px solid #ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            outline: 'none',
            transition: 'border-color 0.3s ease-in-out',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#ff9a9e')}
          onBlur={(e) => (e.target.style.borderColor = '#ffffff')}
        />
            <button
      type="submit"
      style={{
        padding: '12px 25px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#ff6f61',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, background-color 0.3s ease-in-out',
      }}
      onMouseOver={(e) =>
        ((e.target as HTMLButtonElement).style.backgroundColor = '#ff886f')
      }
      onMouseOut={(e) =>
        ((e.target as HTMLButtonElement).style.backgroundColor = '#ff6f61')
      }
      onMouseDown={(e) =>
        ((e.target as HTMLButtonElement).style.transform = 'scale(0.95)')
      }
      onMouseUp={(e) =>
        ((e.target as HTMLButtonElement).style.transform = 'scale(1)')
      }
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Roast Me'}
    </button>

      </form>
      {response && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          <p style={{ fontSize: '1.2rem', color: '#333' }}>{response}</p>
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
}
