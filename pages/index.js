import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import Message from '../components/message/Message';

export default function Home() {

  const messageRef = useRef();
  const [text, setText] = useState("");
  const[typing, setTyping] = useState(false);
  const [conversation, setConversation] = useState("");
  const [userMessages, setUserMessages] = useState({});
  const [aiConvo, updateAIConvo] = useState("");
  const [humanConvo, updateHumanConvo] = useState("");
  const [visible, setVisible] = useState(false);

  function defaultConversation() {
    return `\nThe following is a conversation with an AI assistant named Adrian. The assistant is helpful, creative, clever, and very friendly.\nHuman: Who are you?\nAI: I am an AI created by OpenAI. How can I help you today?`
  }

  function getPrompt(question) {
    return `${conversation}\nHuman:${question}`
  }

  function updatePrompt(response) {
    return `${conversation}\nAI:${response}`
  }

  useEffect(()=>{
    setConversation(defaultConversation())
  },[])

  useEffect(()=>{
    setConversation(humanConvo)
  },[humanConvo])

  useEffect(()=>{
    setConversation(aiConvo)
  },[aiConvo])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const date = new Date()
      setUserMessages(prevState => ({
        ...prevState,
        [date] : {
                "sender": "user",
                "content": text,
                "date": date,
              }
        })
      )

      const temp = getPrompt(text);
      updateHumanConvo(temp)
  
      console.log("AFTER", temp, humanConvo);
      setText("");
      setTyping(true);

      const res = await fetch(`/api/openai`, {
        body: JSON.stringify({
          name: temp
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })

      const response = await res.json();

      console.log("RESAI:", response['text'])

      if (response) {
        const newDate = new Date()
        setUserMessages(prevState => ({
          ...prevState,
          [newDate] : {
                  "sender": "chatbot",
                  "content": response['text'].split(":")[1],
                  "date": newDate,
                }
          })
        )

        setTyping(false);

        const temp2 = updatePrompt(response['text'].split(":")[1]);
        updateAIConvo(temp2);

        console.log("NEW", temp2, conversation)
      }

    }catch(err){
    console.log(err)
  }
}

const handleHint = () => {
  setVisible(true);
}

  const renderMessages = userMessages && Object.entries(userMessages).map(([key, value]) => (
    <div ref={messageRef} key={key}>
      <Message sender={[value['sender']]} content={value['content']}/>
    </div>
  ))

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: "end",
        inline: "nearest",
        }
      )
    }
  })

  // useEffect(() => {
  //   var objDiv = document.getElementById("message_area");
  //   objDiv.scrollTop = objDiv.scrollHeight;
  // },[userMessages]);

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Chatbot</title>
        <meta name="description" content="Created by Philip Barven for educational purposes." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{margin:"65px 10%", background:"whitesmoke", height:"450px", borderRadius:"9px", overflow:"hidden", position:"relative", border:"1px solid whitesmoke", boxShadow:"3px 3px 15px lightgray"}}>
        <div style={{height:"50px", background:"whitesmoke", top:"0", borderRadius:"5px 5px 0px 0px", padding:"10px", textAlign:"center"}}>
          {!typing ? (
            <h1 style={{margin:"0", fontSize:"1.4em", textShadow:"1px 1px black", color:"darkgray"}}>
              Adrien
            </h1>
          ):(
            <h1 style={{margin:"0", fontSize:"0.9em", textShadow:"1px 1px black", color:"darkgray"}}>
              Typing...
            </h1>
          )}
        </div>
        <div style={{display:"flex", flexDirection:"column", height:"350px"}}>
          <div id="message_area" style={{display:"flex", flexDirection:"column", height:"325px", background:"radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(173,173,190,1) 11%, rgba(168,236,232,1) 100%, rgba(0,212,255,1) 100%)", position:"absolute", width:"100%", borderRadius:"3px", overflowY:"scroll", overflowX:"hidden", paddingBottom:"50px"}}>
          {renderMessages}
          </div>
          <div style={{opacity:"0.9",bottom:"0",display:"flex", flexDirection:"column", height:"50px", background:"radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(173,173,190,1) 11%, rgba(168,236,232,1) 100%, rgba(0,212,255,1) 100%)", position:"absolute", width:"100%", borderRadius:"3px", overflowY:"scroll", overflowX:"hidden", paddingBottom:"75px"}}>          
          </div>
        </div>
        <div style={{display:"flex", justifyContent:"center", bottom:"0", width:"100%", position:"absolute", alignItems:"center", marginLeft:"15px"}}>
          <form onSubmit={handleSubmit} style={{display:"inline-block",position:"relative", margin:"0", padding:"0px", width:"90%", justifyContent:"center", alignItems:"center"}}>
            <textarea 
              style={{display:"block",height:"fit-content", width:"96%", height:"fit-content", maxHeight:"150px",overflowX:"unset", padding:"10px 30px", margin:"20px 10px ", resize:"none", border:"none", borderRadius:"9px", boxShadow:"1px 1px 3px lightgray"}} 
              placeholder="Type a message"
              onChange={(e)=>{setText(e.target.value)}}
              value={text}
              >
            </textarea>
            <button style={{
              position:"absolute", cursor:"pointer",margin:"0px", 
              padding:"0px",border:"none", background:"transparent", 
              fontSize:"1.3em",bottom:"35px", right:"22px"
              }}
              disabled={!text}
              type="submit"
              >
            ⬆️ 
            </button>
          </form>
          <button 
            style={{cursor:"pointer",fontSize:"1.6em", border:"none", background:"transparent", textShadow:"1px 1px lightgray", marginRight:"35px", padding:"0px"}}
            onClick={() =>{alert("Feature coming soon!")}}>
            😄
          </button>
        </div>
      </div>
      {/* {JSON.stringify(conversation)} */}
      <center>
        {visible ? (
          <p>If you get too many blank resnponses, refresh the page to restart the conversation.</p>
        ) : (
          <button 
            type="button" 
            onClick={handleHint}
            style={{cursor:"pointer", margin:"15px", background:"whitesmoke", border:"none", background:"lightgray", width:"50px", height:"30px",  borderRadius:"3px", fontSize:"large"}}
            >Hint
          </button>
        )}
      </center>
      <footer className={styles.footer}>
        <a
          href="https://www.youtube.com/watch?v=xvFZjo5PgG0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
