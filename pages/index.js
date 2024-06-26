import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import Message from '../components/Message';
import Survey from '../components/Survey';
import { Button } from 'antd';
import {toast} from 'react-toastify';

export default function Home() {

  const messageRef = useRef();
  const [text, setText] = useState("");
  const[typing, setTyping] = useState(false);
  const [conversation, setConversation] = useState("");
  const [userMessages, setUserMessages] = useState({});
  const [aiConvo, updateAIConvo] = useState("");
  const [humanConvo, updateHumanConvo] = useState("");
  const [visible, setVisible] = useState(false);
  const hints = [
    "If you get too many blank resnponses, refresh the page to restart the conversation.",
    "Try speaking in a different language!",
    "Not fun? Say 'recite for me a sonnet'",
    "Feeling down? Say 'Tell me a joke'",
    "Not getting responses? Try saying hello again",
    "Reloading restarts the conversation",
  ];

  function defaultConversation() {
    return `\nThe following is a conversation with an AI assistant named Adrien. The assistant is helpful, creative, clever, and very friendly.\nHuman: Who are you?\nAI: I am an AI created by OpenAI. How can I help you today?`
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
      // toast.info("Info")
      const date = new Date()
      setUserMessages(prevState => ({
        ...prevState,
        [date] : {
                "sender": "You",
                "content": text,
                "date": date,
              }
        })
      )

      const temp = getPrompt(text);
      updateHumanConvo(temp)
  
      // console.log("AFTER", temp, humanConvo);
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

      // console.log("RESAI:", response['text'])

      if (response) {
        const newDate = new Date()
        setUserMessages(prevState => ({
          ...prevState,
          [newDate] : {
                  "sender": "Adrien",
                  "content": response['text'].split(":")[1],
                  "date": newDate,
                }
          })
        )

        setTyping(false);

        const temp2 = updatePrompt(response['text'].split(":")[1]);
        updateAIConvo(temp2);

        // console.log("NEW", temp2, conversation)
      }

    }catch(err){
    console.log(err)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function get_hint (list) {
  return list[Math.floor((Math.random()*list.length))];
}

const handleHint = async () => {
  setVisible(true);
  await sleep(3000);
  setVisible(false);
}

function check_text(text) {
  if (text?.replace(/\s/g,"") == "" || text?.length == 0 || text == undefined || text == null) {
    return "..."
  } else{
    return text
  }
}

  const renderMessages = userMessages && Object.entries(userMessages).map(([key, value]) => (
    <div ref={messageRef} key={key}>
      <Message sender={[value['sender']]} content={check_text(value['content'])} time={key}/>
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
      <div className={styles.chatbot_container}>
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
              style={{display:"block",height:"fit-content", width:"97%", height:"fit-content", maxHeight:"150px",overflowX:"unset", padding:"10px 30px", margin:"20px 10px ", resize:"none", border:"none", borderRadius:"9px", boxShadow:"1px 1px 3px lightgray", backgroundColor:"white"}} 
              placeholder="Type a message"
              onChange={(e)=>{setText(e.target.value)}}
              value={text}
              >
            </textarea>
            <button style={{
              position:"absolute", cursor:"pointer",margin:"0px", 
              padding:"0px",border:"none", background:"transparent", 
              fontSize:"1.3em",bottom:"40px", right:"30px"
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
          <p>{get_hint(hints)}</p>
        ) : (
          <div style={{display:"flex", justifyContent:"center", flexDirection:"column", width:"100px", padding:"5px"}}>
            <Survey/>
            <Button
              type="primary" 
              onClick={handleHint}
              style={{whiteSpace: "normal", height:'auto', margin:'15px', textAlign:"center", padding:"5px"}}
              >Hint
            </Button>
          </div>
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
