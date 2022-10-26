import { useEffect, useState } from "react";

const Message = ({sender, content}) => {

    const [m_sender, setSender]= useState("");
    const [m_content, setContent] = useState("");

    useEffect(() => {
        setSender(sender)
    }, [sender])

    useEffect(() => {
        setContent(content)
    }, [content])

    return (
        <>
            {m_sender && m_sender == "user" && (
                <div style={{height:"fit-content", width:"100%", margin:"0px 0px 10px 0px", background:"transparent"}}>
                    <div style={{display:"flex", flexDirection:"column",justifyContent:"center", margin:"10px", minHeight:"30px", height:"fit-content", width:"fit-content", maxWidth:"55%", minWidth:'75px', float:"right", maxHeight:"fit-content", marginBottom:"0px"}}>
                        <div style={{background:"red", width:"100%", padding:"10px 5px 5px 10px",lineHeight:"25px", minHeight:"30px", borderRadius:"5px", background:"linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(252,176,69,0.4017094017094017) 0%, rgba(29,245,253,0.292022792022792) 200%)",boxShadow:"3px 2px 5px darkgray"}}>
                            <p style={{margin:"0", padding:"0", fontSize:"0.9em"}}>{m_content}</p>
                        </div>
                        <div style={{background:"transparent", width:"100%", textAlign:"right"}}>
                            <p style={{margin:"0", padding:"0", fontSize:"0.9em"}}>{m_sender}</p>
                        </div>
                    </div>
                </div>
            )}
            {m_sender && m_sender == "chatbot" && (
                <div style={{height:"fit-content", width:"100%", margin:"0px 0px 0px 20px", background:"transparent"}}>
                    <div style={{display:"flex", flexDirection:"column",justifyContent:"center", margin:"10px", minHeight:"30px", height:"fit-content", width:"fit-content", maxWidth:"55%", minWidth:'75px', float:"left", maxHeight:"fit-content", marginBottom:"0px"}}>
                        <div style={{background:"red", width:"100%", padding:"10px 5px 5px 10px",lineHeight:"25px", minHeight:"30px", borderRadius:"5px", background:"whitesmoke", boxShadow:"-3px 1px 5px darkgray"}}>
                            <p style={{margin:"0", padding:"0", fontSize:"0.9em"}}>{m_content}</p>
                        </div>
                        <div style={{background:"transparent", width:"100%", textAlign:"right"}}>
                            <p style={{margin:"0", padding:"0", fontSize:"0.9em"}}>{m_sender}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Message;