'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(false); // Track chatbox visibility
  const [stage, setStage] = useState<'calling' | 'message' | 'features'>('calling'); // Chatbox animation stages
  const [typedMessage, setTypedMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]); // Chat messages
  const [selectedFeature, setSelectedFeature] = useState(''); // Track selected feature
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }); // Mouse position
  const infoSectionRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling to the info section
  const topSectionRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling back to the top section

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleSendMessage = async () => {
    if (typedMessage.trim()) {
      // Base message for all features
      let taggedMessage = "Here's what I need you to do. Pretend you're my witty, sarcastic, brutally honest grandpa, and don't be afraid to be a little mean. ";
    
      // Append specific text based on the selected feature
      switch (selectedFeature) {
        case "Motivational Roast":
          taggedMessage += "I want you to meanly and unabashedly roast me for the following, in hopes of motivating me a little bit.";
          break;
        case "Decision Roulette":
          taggedMessage += "Help me decide between these choices—with a wild, unexpected justification.";
          break;
        case "Savage Compliment":
          taggedMessage += "Give me a super savage compliment.";
          break;
        case "Tough Love Therapy":
          taggedMessage += "Give it to me straight based on this problem I have. I need some tough love right now.";
          break;
        case "Regret Predictor":
          taggedMessage += "Give me a super over-the-top worst-case scenario for my decision.";
          break;
        case "Grandpa’s Trivia Corner":
          taggedMessage += "Give me a questionable 'fact' that feels like old-man rambling.";
          break;
        case "Roast Your Day":
          taggedMessage += "Meanly and savagely evaluate my day with exaggerated reactions.";
          break;
        case "DIY Excuses":
          taggedMessage += "Give me a totally bizarre excuse for ";
          break;
        default:
          taggedMessage += "Just respond sarcastically and honestly.";
          break;
      }
    
      // Append the user's typed message
      taggedMessage += ` ${typedMessage}`;
    
      // Update the messages array with the user's input
      setMessages((prev) => [...prev, `You: ${typedMessage}`]);

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userInput: taggedMessage }),
        });
        //console.log(taggedMessage);
        //console.log(response.json());
        if (response.ok) {
          const data = await response.json(); // Ensure this resolves properly
          if (data && data.response) {
            setMessages((prev) => [...prev, `Grandpa: ${data.response}`]); // Use the response
          } else {
            // Fallback if the expected key is missing
            setMessages((prev) => [...prev, "Grandpa: Hmm, I couldn't find anything witty to say!"]);
          }
        } else {
          setMessages((prev) => [...prev, "Grandpa: Sorry, I couldn't process that. Try again!"]);
        }
      } catch (error) {
        console.error("Error while fetching Grandpa's response:", error);
        setMessages((prev) => [...prev, "Grandpa: Something went wrong. Please try later."]);
      }

      setTypedMessage('');
    }
  };

  useEffect(() => {
    if (isChatVisible) {
      // Start the calling animation
      setStage('calling');
      const timer = setTimeout(() => {
        setStage('message');
      }, 1000); // 1 second for calling animation
      return () => clearTimeout(timer);
    }
  }, [isChatVisible]);

  useEffect(() => {
    if (stage === 'message') {
      const fetchGrandpaMessage = async () => {
        try {
          // Call the OpenAI API with the desired prompt
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userInput: "Pretend you're my witty sarcastic grandpa, and you're texting me back saying you can't take my call right now (give some funky excuse) but ask me how you can help.",
            }),
          });
  
          if (response.ok) {
            const data = await response.json();
            const grandpaMessage = data.response || "Sorry, no witty response this time.";
  
            // Update the messages with the dynamic response
            setMessages((prev) => [...prev, `Grandpa: ${grandpaMessage}`]);
          } else {
            console.error('Failed to fetch grandpa response:', response.statusText);
            setMessages((prev) => [...prev, "Grandpa: Oops, technical difficulties! Your grandpa is getting old"]);
          }
        } catch (error) {
          console.error('Error fetching grandpa response:', error);
          setMessages((prev) => [...prev, "Grandpa: Oops, technical difficulties!"]);
        }
      };
  
      // Fetch the dynamic grandpa message
      fetchGrandpaMessage();
  
      // Move to the next stage after a delay
      const timer = setTimeout(() => {
        setStage('features');
      }, 1000); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [stage]);
  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }} onMouseMove={handleMouseMove}>
      {/* Top Section with Dark Gray Background */}
      <div
        ref={topSectionRef}
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Light Effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: "url('/grandpa.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(80%)', // Slightly dimmed
            clipPath: `circle(180px at ${mousePosition.x}px ${mousePosition.y}px)`,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        ></div>

        {/* Blocky 3D Text */}
        <h1
          style={{
            fontSize: '4rem',
            color: '#ff6f61',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            textShadow: `
              1px 1px 0px #e5534b,
              2px 2px 0px #d14d46,
              3px 3px 0px #b9453e,
              4px 4px 0px #a33e37,
              5px 5px 0px #8e3731,
              6px 6px 0px #7a302b
            `,
            marginBottom: '20px',
            textAlign: 'center',
            zIndex: 10,
            position: 'relative',
          }}
        >
          Your Brutally Honest Grandpa
        </h1>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {/* Talk to Grandpa Button */}
          <button
            onClick={() => setIsChatVisible(true)}
            style={{
              padding: '15px 30px',
              zIndex: '100',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#ff6f61',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.2s ease-in-out, background-color 0.3s ease-in-out',
            }}
          >
            Talk to Grandpa
          </button>

          {/* Who's Grandpa Button */}
          <button
            onClick={() => scrollToSection(infoSectionRef)}
            style={{
              padding: '15px 30px',
              zIndex: '100',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#4caf50',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.2s ease-in-out, background-color 0.3s ease-in-out',
            }}
          >
            Who&apos;s Grandpa?
          </button>
        </div>

        {/* Chatbox Module */}
        {isChatVisible && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '700px',
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#ff6f61',
                color: '#ffffff',
                padding: '10px 20px',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              GRANDPA
              <button
                onClick={() => setIsChatVisible(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Calling Animation */}
            {stage === 'calling' && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.5rem',
                  color: '#555',
                }}
              >
                📞 Calling Grandpa...
              </div>
            )}

            {/* Message and Features */}
            {stage === 'features' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', color: 'black', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg, index) => {
                const isUser = msg.startsWith('You:');
                const messageText = isUser ? msg.replace('You: ', '') : msg.replace('Grandpa: ', ''); // Remove the prefix
            
                return (
                  <div
                    key={index}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      backgroundColor: isUser ? '#4caf50' : '#f1f1f1',
                      color: isUser ? '#fff' : '#000',
                      padding: '10px 15px',
                      borderRadius: '15px',
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {messageText}
                  </div>
                );
              })}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                  {[
                    'Motivational Roast',
                    'Decision Roulette',
                    'Savage Compliment',
                    'Tough Love Therapy',
                    'Regret Predictor',
                    'Grandpa’s Trivia Corner',
                    'Roast Your Day',
                    'DIY Excuses'
                  ].map((feature) => (
                    <button
                      key={feature}
                      onClick={() => setSelectedFeature(feature)}
                      style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        backgroundColor: selectedFeature === feature ? '#ff6f61' : '#4caf50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                borderTop: '1px solid #ddd',
                color: 'black',
              }}
            >
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '10px',
                  color: '#000', // User input text is now black
                  backgroundColor: '#f9f9f9',
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  padding: '10px',
                  backgroundColor: '#ff6f61',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              >
                ✈️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* White Info Section */}
      <div
        ref={infoSectionRef}
        style={{
          height: '250vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0 20px' }}>
  <h2 style={{ marginBottom: '20px', fontSize: '2.5rem', color: '#333' }}>Who&apos;s Grandpa?</h2>
  <p style={{ fontSize: '1.2rem', color: '#333', lineHeight: '1.8rem', margin: '0 auto', maxWidth: '800px' }}>
    <strong style={{ fontSize: '1.4rem', color: '#ff6f61' }}>Your Brutally Honest Grandpa </strong> 
    is your no-nonsense, digital dose of tough love, sarcasm, and humor. Designed to 
    <span style={{ color: '#007bff', fontWeight: 'bold' }}> roast</span>, 
    <span style={{ color: '#28a745', fontWeight: 'bold' }}> motivate</span>, and 
    <span style={{ color: '#ffc107', fontWeight: 'bold' }}> entertain</span>, 
    he uses a blend of absurdity and wit to help you tackle life&apos;s challenges.
  </p>
  <p style={{ fontSize: '1.2rem', color: '#333', lineHeight: '1.8rem', margin: '0 auto', maxWidth: '800px', marginTop: '20px' }}>
    Built with elements of AI powered by <strong>OpenAI&apos;s API</strong>, and coded with <strong>React.js</strong>, 
    Your Brutally Honest Grandpa combines humor and motivation into one quirky package.
  </p>
  <div style={{ textAlign: 'left', margin: '20px auto', maxWidth: '800px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
    <strong style={{ fontSize: '1.4rem', display: 'block', marginBottom: '10px', color: '#333' }}>What Grandpa does:</strong>
    <p style={{color: '#333'}}>(You tell him, depending on what you need. Just give him some context after you press the button.)</p>
    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8rem' }}>
      <li>
        <strong style={{ color: '#ffc107' }}>Motivational Roast:</strong> <span style={{ color: '#333' }}>Grandpa humbles you a little while motivating you to do better.</span>
      </li>
      <li>
        <strong style={{ color: '#ff6f61' }}>Decision Roulette:</strong> <span style={{ color: '#333' }}>Grandpa &quot;decides&quot; between your choices—with a wild, unexpected justification.</span>
      </li>
      <li>
        <strong style={{ color: '#007bff' }}>Savage Compliments:</strong> <span style={{ color: '#333' }}>Need a boost? Get sarcastic or backhanded compliments that make you laugh.</span>
      </li>
      <li>
        <strong style={{ color: '#28a745' }}>Tough Love Therapy:</strong> <span style={{ color: '#333' }}>Describe your problem in a few words, and Grandpa gives it to you straight.</span>
      </li>
      <li>
        <strong style={{ color: '#ffc107' }}>Regret Predictor:</strong> <span style={{ color: '#333' }}>See a hilariously over-the-top worst-case scenario for your decision.</span>
      </li>
      <li>
        <strong style={{ color: '#ff6f61' }}>Grandpa’s Trivia Corner:</strong> <span style={{ color: '#333' }}>Laugh at humorous, questionable &quot;facts&quot; that feel like old-man rambling.</span>
      </li>
      <li>
        <strong style={{ color: '#007bff' }}>Roast Your Day:</strong> <span style={{ color: '#333' }}>Input how your day went, and Grandpa evaluates it with exaggerated reactions.</span>
      </li>
      <li>
        <strong style={{ color: '#28a745' }}>DIY Excuses:</strong> <span style={{ color: '#333' }}>Assemble bizarre excuses with mix-and-match components.</span>
      </li>
    </ul>
  </div>

          {/* Example Image */}
    <img 
      src="/exampleRoast.jpg" 
      alt="Grandpa" 
      style={{
        display: 'block',
        margin: '20px auto',
        width: '300px',
        height: '430px',
        borderRadius: '5%',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        objectPosition: '0px -3px', // Moves the image down by 3px
          marginTop: '+3px', // Adjust height visually
      }} 
    />
    <p style={{color: 'black'}}>An exchange with Grandpa might look something like this, for example. Don&apos;t take it too personally, he&apos;s just trying to help!</p>

  <p style={{ fontSize: '1.2rem', color: '#333', lineHeight: '1.8rem', margin: '0 auto', maxWidth: '800px', marginTop: '20px' }}>
    Inspired by my real-life grandfather&apos;s unfiltered honesty, this web app reflects his philosophy: 
    <span style={{ color: '#ff6f61', fontWeight: 'bold' }}> don’t take yourself too seriously, but always keep moving forward. </span> 
    It’s designed for a generation bogged down by overthinking, procrastination, and the pressure of modern life. 
    <strong style={{ color: '#007bff' }}> Laugh, reflect, and get things done</strong>—all without the sugarcoating. 
    <br />Thanks for visiting!! <br/>
  </p>
  <button
    onClick={() => scrollToSection(topSectionRef)}
    style={{
      marginTop: '30px',
      padding: '15px 30px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#ff6f61',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.4)',
      transition: 'transform 0.2s ease-in-out, backgroundColor 0.3s ease-in-out',
    }}
  >
    Back to Top
  </button>
  <p style={{color: 'black'}}><br/><br/><br/>made with ❤️ by Joy</p>
</div>
      </div>
    </div>
  );
}
