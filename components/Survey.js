import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { FrownOutlined, SmileOutlined, SyncOutlined } from '@ant-design/icons';
import { Slider, Collapse } from 'antd';
import {toast} from 'react-toastify';

const { Panel } = Collapse;

const consentAgreement = () => {
    return (
            <p>
                Purpose of the research: I am a university student studying in Minerva Schools, and are conducting a survey to learn whether a market exists for an AI based chatbot for mental health triage.
                <br/><br/>
                What you will do in this research:
                This survey will pose 5 questions for you to answer. These questions will be related to the experience, daily use, likely recommendation, mood and feelings of trust perceived from the interaction with the chatbot.
                <br/><br/>
                Time required:
                This survey will take approximately 1 minutes to complete.
                <br/><br/>
                Risks:
                There are no anticipated risks from participating in this survey.
                <br/><br/>
                Benefits:
                By participating in this survey you will help the student conducting the study to determine whether there is a market for the chatbot.
                <br/><br/>
                Confidentiality:
                Your participation in this study will remain confidential as I am not collecting any identifying information.
                <br/><br/>
                Participation and withdrawal:
                Your participation in this study is completely voluntary, and you may withdraw at any time without penalty. You may withdraw by informing the investigator that you no longer wish to participate (no questions will be asked).
                <br/><br/>
                Contact:
                If you have questions about this research, please contact Professor Levy Odera, PhD (<a href = "mailto: lodera@minerva.edu">lodera@minerva.edu</a>).
                <br/>
            </p>
    )}

const Survey = () => {
    
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);
    const [value3, setValue3] = useState(0);
    const [value4, setValue4] = useState(0);
    const [value5, setValue5] = useState(0);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState("0");
    const [updateValues, setUpdateValues] = useState({});

    const showModal = () => {
        setIsModalOpen(!isModalOpen);
        setCurrentView("0")
        setValue1(0)
        setValue2(0)
        setValue3(0)
        setValue4(0)
        setValue5(0)
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChangeView = (view) => {
        setCurrentView(view);
    }

    useEffect(() => {
        setUpdateValues({
            "value1": value1,
            "value2": value2,
            "value3": value3,
            "value4": value4,
            "value5": value5,
        })
    }, [value1, value2, value3, value4, value5])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/surveys`, {
                body: JSON.stringify({
                name: updateValues
                }),
                headers: {
                'Content-Type': 'application/json'
                },
                method: 'POST'
            })   

            toast.success("Survey response successfully captured!")
            setLoading(false);
            showModal();

        } catch(err) {
            toast.error(err.response.data)
        }
    }

    const [key, setKey] = useState("0");
    const [agree, setAgree] = useState(false);

    const onChange = (key) => {
        setKey(key);
    };

    const handleChangeAgree = () => {
        setAgree(!agree)
        if(agree == false){
            setKey("0")
        }
    }

    return (
        <>
            <Button type="primary" onClick={showModal} style={{whiteSpace: "normal", height:'auto', marginTop:'-10px'}}>
                Survey
            </Button>

            <Modal title={`${currentView && currentView != 0 && `Question ${currentView}` || "Survey"}`} open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
                <form onSubmit={handleSubmit}>
                    {currentView == "0" && (
                        <>
                            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", marginTop:"10px"}}>
                                <p>
                                    Please read this consent agreement carefully before agreeing to participate in this study.
                                    <br/><br/>
                                </p>
                                <Collapse defaultActiveKey={['0']} activeKey={key} onChange={onChange}>
                                    <Panel header="Consent Agreement" key="1">
                                        {consentAgreement()}
                                    </Panel>
                                </Collapse>
                                <br/><br/>
                            </div>
                            <div>
                                <input type="checkbox" id="agree" name="agree" checked={agree} onChange={handleChangeAgree}></input>
                                <label for="agree" style={{margin:"10px", fontSize:"14px"}}>I agree to participate in this study</label>
                                <br/><br/><br/>
                            </div>
                            <div style={{float:"right", marginBottom:"3px"}}>
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={() => {handleChangeView("1")}}
                                    disabled={!agree}
                                >
                                    Next
                                </Button>
                            </div>
                            <br/>
                        </>
                    )}
                    
                    {currentView == "1" && (
                        <>
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <p>How was your experience chatting with Adrien?</p>
                            </div>
            
                            <div style={{display:"flex", justifyContent:"space-between", margin:"30px 15px", width:"90%"}}>
                                <FrownOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue1(0)}}/>
                                <div style={{width:"90%"}}>
                                    <Slider min={0} max={5} value={value1} onChange={setValue1}/>
                                    </div>
                                <SmileOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue1(5)}}/>
                            </div>

                            <div>
                                <div style={{float:"left", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("0")}}
                                    >
                                        Back
                                    </Button>
                                </div>
                                <div style={{float:"right", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("2")}}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            <br/>
                        </>
                    )}
                    {currentView == "2" && (
                        <>
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <p>How likely are you to talk to Adrien in your daily life?</p>
                            </div>
            
                            <div style={{display:"flex", justifyContent:"space-between", margin:"30px 15px", width:"90%"}}>
                                <FrownOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue2(0)}}/>
                                <div style={{width:"90%"}}>
                                    <Slider min={0} max={5} value={value2} onChange={setValue2}/>
                                    </div>
                                <SmileOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue2(5)}}/>
                            </div>
                            
                            <div>
                                <div style={{float:"left", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("1")}}
                                    >
                                        Back
                                    </Button>
                                </div>
                                <div style={{float:"right", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("3")}}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            <br/>
                        </>
                    )}
                    {currentView == "3" && (
                        <>
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <p>How likely are you to recommend this to your friend?</p>
                            </div>
            
                            <div style={{display:"flex", justifyContent:"space-between", margin:"30px 15px", width:"90%"}}>
                                <FrownOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue3(0)}}/>
                                <div style={{width:"90%"}}>
                                    <Slider min={0} max={5} value={value3} onChange={setValue3}/>
                                    </div>
                                <SmileOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue3(5)}}/>
                            </div>

                            <div>
                                <div style={{float:"left", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("2")}}
                                    >
                                        Back
                                    </Button>
                                </div>
                                <div style={{float:"right", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("4")}}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            <br/>
                        </>
                    )}
                    {currentView == "4" && (
                        <>
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <p>How likely is Adrien to improve your mood?</p>
                            </div>
            
                            <div style={{display:"flex", justifyContent:"space-between", margin:"30px 15px", width:"90%"}}>
                                <FrownOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue4(0)}}/>
                                <div style={{width:"90%"}}>
                                    <Slider min={0} max={5} value={value4} onChange={setValue4}/>
                                    </div>
                                <SmileOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue4(5)}}/>
                            </div>

                            <div>
                                <div style={{float:"left", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("3")}}
                                    >
                                        Back
                                    </Button>
                                </div>
                                <div style={{float:"right", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("5")}}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            <br/>
                        </>
                    )}
                    {currentView == "5" && (
                        <>
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <p>How likely are you to trust advice from Adrien?</p>
                            </div>
            
                            <div style={{display:"flex", justifyContent:"space-between", margin:"30px 15px", width:"90%"}}>
                                <FrownOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue5(0)}}/>
                                <div style={{width:"90%"}}>
                                    <Slider min={0} max={5} value={value5} onChange={setValue5}/>
                                    </div>
                                <SmileOutlined style={{fontSize:"1.1em"}} onClick={() => {setValue5(5)}}/>
                            </div>
                            
                            <div>
                                <div style={{float:"left", marginBottom:"3px"}}>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {handleChangeView("4")}}
                                        disabled={loading}
                                    >
                                        Back
                                    </Button>
                                </div>
                                <div style={{float:"right", marginBottom:"3px"}}>
                                    {loading ? (
                                        <SyncOutlined spin style={{fontSize:'1.5em', padding:'0px', margin:'0px'}}/>
                                    ) : (

                                        <Button
                                            type='primary'
                                            ghost
                                            onClick={handleSubmit}
                                            >
                                                Submit
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <br/>
                        </>
                    )}
                </form>
            </Modal>
        </>
    )
}

export default Survey;