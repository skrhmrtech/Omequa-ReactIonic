import { useEffect, useRef, useState } from 'react';
import {
    IonPage,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

import { LuUpload } from "react-icons/lu";
import { RiSendPlaneFill } from "react-icons/ri";
import { PiLinkBreakBold } from "react-icons/pi";

import { Message } from '../../utility/Types';
import Header from '../../components/header';
import Messages from '../../components/common/Messages';
import Investors from '../../components/common/Investors';
import Input from '../../components/input/Input';

import './Chat.css';

const SOCKET_URL = "ws://api.omequa.com/chat";

const Chat: React.FC = () => {
    const history = useHistory();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [keyboardOpen, setKeyboardOpen] = useState(0);

    const [chatActive, setChatActive] = useState(false);
    const [userLeave, setUserLeave] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<Message>>([]);

    const location = useLocation<{ secretCode: string; fullName: string; gender: string }>();
    const { secretCode, fullName, gender } = location?.state || {};

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!secretCode || !fullName || !gender) {
            history.replace('/');
            return;
        }

        // Initialize WebSocket connection
        const connectWebSocket = () => {
            ws.current = new WebSocket(`${SOCKET_URL}?secretCode=${secretCode}&fullName=${fullName}&gender=${gender}`);

            ws.current.onopen = () => {
                setChatActive(true);
                setUserLeave(false);
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "text") {
                    setMessages((prevMessages) => [...prevMessages, { text: data.message, sender: 1 }]);
                }
            };

            ws.current.onclose = () => {
                setChatActive(false);
                setUserLeave(true)
            };
        };

        connectWebSocket();

        return () => {
            ws.current?.close();
        }
    }, [secretCode, fullName, gender]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            Keyboard.addListener('keyboardDidShow', (info) => setKeyboardOpen(info?.keyboardHeight - 50));
            Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(0));
        }
    }, []);

    const sendMessage = (msg = message) => {
        if (!msg.trim()) return

        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'text', message: msg }));

            setMessages([...messages, { text: msg }]);
            setMessage('');
        }
    };

    return (
        <IonPage>
            <IonContent className="select-none flex flex-col h-full" style={{ backgroundColor: "#ffffff" }} fullscreen>
                <IonGrid className="w-full h-full flex justify-center" style={{ height: `calc(100vh - ${keyboardOpen}px)` }}>
                    <IonRow className="w-full max-w-md px-5 flex flex-col h-full">
                        <div className="h-[10%] flex items-end pb-2">
                            <Header title='User' isBack={true} />
                        </div>

                        {/* Form Section */}
                        <IonCol className="flex-grow overflow-y-auto select-text">
                            {
                                userLeave ? (
                                    <div className='h-full flex flex-col justify-center items-center'>
                                        <div className="text-center mb-5 flex flex-col items-center">
                                            <div className="bg-[#fff6f2] shadow-lg shadow-[#ffc6b2] rounded-full m-5 px-5 py-3 border-2 border-[#ff4a0a] border-b-0">
                                                <PiLinkBreakBold className="text-[#ff4a0a] text-5xl " />
                                            </div>
                                            <p className="text-[#ff4a0a] mb-3 font-semibold">User is Disconnected</p>
                                        </div>

                                        {/* Investor Section */}
                                        <Investors />
                                    </div>
                                ) : (
                                    <div className='mt-3 p-1'>
                                        {chatActive && <Messages messages={messages} />}
                                        <div ref={chatEndRef} />
                                    </div>
                                )
                            }
                        </IonCol>

                        {/* Bottom Section */}
                        <div className={`h-[${!userLeave && chatActive ? '22.5%' : '12.5%'}] flex flex-col justify-start pt-2`} >
                            <div className='w-full text-center mb-2'>
                                {
                                    userLeave ? (
                                        <span className="text-[#0f5999] text-sm bg-[#edf6ff] p-2 rounded-md cursor-pointer" onClick={() => { history.replace('/') }}>Go to Home</span>
                                    ) : chatActive ? (
                                        <div className='w-[50%] mx-auto'>
                                            <span className='text-[#0f5999] text-sm bg-[#edf6ff] px-2 py-2.5 rounded-xl flex gap-2 justify-center items-center cursor-pointer' onClick={() => { }}>
                                                <LuUpload className='text-xl' />
                                                Upload Photo
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-[#0f5999] text-sm bg-[#edf6ff] p-1 rounded-md">Connected to User</p>
                                    )
                                }
                            </div>

                            <div className='flex w-full'>
                                <div className='w-1/2 p-1'>
                                    <IonButton expand="full" fill="clear" size="large" className='capitalize rounded-2xl bg-[#68b2ff] text-white text-lg' onClick={() => { !userLeave && setChatActive(true) }}>
                                        New Chat
                                    </IonButton>
                                </div>
                                <div className='w-1/2 p-1'>
                                    <IonButton expand="full" fill="clear" size="large" className='capitalize rounded-2xl bg-[#a943a0] text-white text-lg' onClick={() => { }}>
                                        Req Photo
                                    </IonButton>
                                </div>
                            </div>

                            {
                                !userLeave && chatActive && (
                                    <div className='flex w-full p-1'>
                                        <Input
                                            name='message'
                                            itemId='chat-input-box'
                                            placeholder='Enter message...'
                                            value={message}
                                            onIonChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) sendMessage(e.currentTarget.value);
                                            }}
                                            slots={(
                                                <IonButton size='small' fill="clear" slot="end" className='bg-[#68b2ff] my-1 rounded-lg text-white hover:text-black hover:transition duration-300' onClick={() => sendMessage(message)}>
                                                    <RiSendPlaneFill className="text-3xl m-2" />
                                                </IonButton>
                                            )}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage >

    );
};

export default Chat;