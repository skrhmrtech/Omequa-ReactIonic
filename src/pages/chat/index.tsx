import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
    IonPage,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

import { PiLinkBreakBold } from "react-icons/pi";
import RiSendPlaneFill from "../../assets/chat/Chat.png";

import Investors from '../../components/common/Investors';
import Messages from '../../components/common/Messages';
import TypingIndicator from '../../components/common/TypingIndicator';
import UploadFiles from '../../components/common/UploadFiles';
import Header from '../../components/header';
import Input from '../../components/input/Input';
import { generateRandomCode } from '../../utility';
import { Message } from '../../utility/Types';

import './Chat.css';

const SOCKET_URL = "wss://api.omequa.com/chat";

const Chat: React.FC = () => {
    const history = useHistory();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const { secretCode, fullName, gender } = useLocation<{ secretCode: string; fullName: string; gender: string }>()?.state || {};

    const [keyboardOpen, setKeyboardOpen] = useState(0);
    const [chatActive, setChatActive] = useState(false);
    const [userLeave, setUserLeave] = useState(false);
    const [userName, setUserName] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!secretCode || !fullName || !gender) return history.replace('/');

        // Initialize WebSocket connection
        const connectWebSocket = () => {
            ws.current = new WebSocket(`${SOCKET_URL}?secretCode=${secretCode}&fullName=${fullName}&gender=${gender}`);
            ws.current.onopen = () => handleConnectLeave(true);
            ws.current.onmessage = (event) => handleMessage(event);
            ws.current.onclose = () => handleConnectLeave(false);
        };

        connectWebSocket();
        return () => ws.current?.close();
    }, [secretCode, fullName, gender]);

    useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isTyping]);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            Keyboard.addListener('keyboardDidShow', (info) => setKeyboardOpen(info?.keyboardHeight - 50));
            Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(0));
        }
        return () => { typingTimeoutRef.current && clearTimeout(typingTimeoutRef.current) };
    }, []);

    const handleConnectLeave = (isConnect: boolean) => {
        setChatActive(isConnect);
        setUserLeave(!isConnect);
        isConnect && setUserName(null);
        setMessages([]);
    }

    const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type !== "text") return;

        try {
            const jsonObj = JSON.parse(data.message);

            if (jsonObj?.fullName) setUserName(jsonObj.fullName);
            if ('isTyping' in jsonObj) return handleTyping(jsonObj.isTyping);
            if (jsonObj?.receiveImage && jsonObj?.id) return updateImage(jsonObj.id, jsonObj.receiveImage);

            setMessages((prev) => [...prev, { ...jsonObj, sender: 1 }]);
        } catch {
            setMessages((prev) => [...prev, { text: data.message, sender: 1 }]);
        }
    };

    const handleTyping = (typing: boolean) => {
        setIsTyping(typing);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (typing) typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
    };

    const updateImage = (id: string, image: string) => {
        setMessages((prev) => prev.map((msg) => (msg?.id === id ? { ...msg, receiveImage: image } : msg)));
    };


    const sendMessage = (msg = message, args: Object = {}) => {
        if (!msg.trim() || ws.current?.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({ type: 'text', message: JSON.stringify({ text: msg, fullName, ...args }) }));
        setMessages([...messages, { text: msg, ...args }]);
        setMessage('');
    };

    const sendTypingEvent = (isTyping: boolean) => {
        if (ws.current?.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({ type: 'text', message: JSON.stringify({ text: null, fullName, isTyping }) }));
    };

    const handleUploadImage = (image: string | null) => image && sendMessage(image);

    const requestForPhoto = () => sendMessage("photo_request", { id: generateRandomCode() });

    const handleRequestedPhotoUpload = (image: string | null, id: string) => {
        if (!(image && id && ws.current?.readyState === WebSocket.OPEN)) return;
        ws.current.send(JSON.stringify({ type: 'text', message: JSON.stringify({ text: null, fullName, receiveImage: image, id }) }));
        updateImage(id, image);
    }

    return (
        <IonPage>
            <IonContent className="select-none flex flex-col h-full" style={{ backgroundColor: "#ffffff" }} fullscreen>
                <IonGrid className="w-full h-full flex justify-center" style={{ height: `calc(100vh - ${keyboardOpen}px)` }}>
                    <IonRow className="w-full max-w-md px-5 flex flex-col h-full">
                        {/* Header Section */}
                        <div className="h-[10%] flex items-end pb-2">
                            <Header title={userName ?? "User"} isBack={true} />
                        </div>

                        {/* Message Section */}
                        <IonCol className="flex-grow overflow-y-auto select-text">
                            {
                                userName && userLeave ? (
                                    <div className='h-full flex flex-col justify-center items-center'>
                                        <div className="text-center mb-5 flex flex-col items-center">
                                            <div className="bg-[#fff6f2] shadow-lg shadow-[#ffc6b2] rounded-full m-5 px-5 py-3 border-2 border-[#ff4a0a] border-b-0">
                                                <PiLinkBreakBold className="text-[#ff4a0a] text-5xl " />
                                            </div>
                                            <p className="text-[#ff4a0a] mb-3 font-semibold">{userName ?? "User"} is Disconnected</p>
                                        </div>
                                        <Investors />
                                    </div>
                                ) : (
                                    <div className='mt-3 p-1'>
                                        {chatActive && <Messages messages={messages} handleFileUpload={handleRequestedPhotoUpload} />}
                                        {isTyping && <TypingIndicator />}
                                        <div ref={chatEndRef} />
                                    </div>
                                )
                            }
                        </IonCol>

                        {/* Bottom Section */}
                        <div className={`h-[${!userLeave && chatActive ? '22.5%' : '12.5%'}] flex flex-col justify-start pt-2 ${!messages.length && 'pb-5'}`} >
                            <div className='w-full text-center mb-2'>
                                {
                                    userName && userLeave ? (
                                        <span className="text-[#0f5999] text-sm bg-[#edf6ff] p-2 rounded-md cursor-pointer" onClick={() => { history.replace('/') }}>Go to Home</span>
                                    ) : (!messages.length && !userName) ? (
                                        <p className="text-[#0f5999] text-sm bg-[#edf6ff] p-1 rounded-md font-bold">Waiting for connection</p>
                                    ) : (
                                        <p className="text-[#0f5999] text-sm bg-[#edf6ff] p-1 rounded-md font-bold">Connected to {userName ?? "User"}</p>
                                    )
                                }
                            </div>

                            <div className={`flex w-full`}>
                                <div className={`w-full p-1 ${!userName && !messages.length && 'hidden'}`}>
                                    <IonButton expand="full" fill="clear" size="large" className='capitalize rounded-2xl bg-[#68b2ff] text-white text-lg' onClick={() => { }}>
                                        New Chat
                                    </IonButton>
                                </div>
                                <div className={`w-full p-1 ${!messages.length && 'hidden'}`}>
                                    <IonButton expand="full" fill="clear" size="large" className='capitalize rounded-2xl bg-[#a943a0] text-white text-lg' onClick={requestForPhoto}>
                                        Req Photo
                                    </IonButton>
                                </div>
                            </div>

                            {
                                !userLeave && chatActive && Boolean(messages.length) && (
                                    <div className='flex w-full p-1'>
                                        <Input
                                            name='message'
                                            itemId='chat-input-box'
                                            placeholder='Enter message...'
                                            value={message}
                                            onIonChange={(e) => {
                                                setMessage(e.target.value)
                                                sendTypingEvent(true)
                                            }}
                                            onKeyDown={(e) => (e.keyCode === 13) ? sendMessage(e.currentTarget.value) : sendTypingEvent(true)}
                                            slots={(
                                                <IonButton size='small' fill="clear" slot="end" className='bg-[#68b2ff] my-1 rounded-lg text-white hover:text-black hover:transition duration-300' onClick={() => sendMessage(message)}>
                                                    <img src={RiSendPlaneFill} alt="" className='w-8 my-1.5 mx-2.5' />
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