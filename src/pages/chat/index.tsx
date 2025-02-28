import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
    IonPage,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
} from '@ionic/react';

import { Oval } from "react-loader-spinner";

import { PiLinkBreakBold } from "react-icons/pi";
import RiSendPlaneFill from "../../assets/chat/Chat.png";

import Investors from '../../components/common/Investors';
import Messages from '../../components/common/Messages';
import TypingIndicator from '../../components/common/TypingIndicator';
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

    const [chatActive, setChatActive] = useState(false);
    const [userName, setUserName] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [isTyping, setIsTyping] = useState(false);

    const connectWebSocket = () => {
        if (!secretCode || !fullName || !gender) return history.replace('/');

        ws.current = new WebSocket(`${SOCKET_URL}?secretCode=${secretCode}&fullName=${fullName}&gender=${gender}`);
        ws.current.onopen = () => handleConnectLeave(true);
        ws.current.onmessage = (event) => handleMessage(event);
        ws.current.onclose = () => handleConnectLeave(false);
    };

    useEffect(() => {
        connectWebSocket();
        return () => ws.current?.close();
    }, [secretCode, fullName, gender]);

    useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isTyping]);
    useEffect(() => { typingTimeoutRef.current && clearTimeout(typingTimeoutRef.current) }, []);

    const handleConnectLeave = (isConnect: boolean) => {
        setChatActive(isConnect);
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
            if (jsonObj?.isConnectionLost) return handleConnectLeave(false);

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

    const sendSpecificMessage = (args: Object = {}, callback: (...params: any[]) => void = () => { }, ...callbackParams: any[]) => {
        if (ws.current?.readyState !== WebSocket.OPEN) return false;
        ws.current.send(JSON.stringify({ type: 'text', message: JSON.stringify({ text: null, fullName, ...args }) }));
        callback(...callbackParams);
    };

    const newConnection = () => !chatActive ? connectWebSocket() : sendSpecificMessage({ isConnectionLost: true }, connectWebSocket);

    const sendTypingEvent = (isTyping: boolean) => sendSpecificMessage({ isTyping });

    const requestForPhoto = () => sendMessage("photo_request", { id: generateRandomCode() });

    const handleRequestedPhotoUpload = (image: string | null, id: string) => {
        (image && id) && sendSpecificMessage({ receiveImage: image, id }, updateImage, id, image);
    }

    return (
        <IonPage>
            <IonContent className="select-none flex flex-col h-full" fullscreen>
                <IonGrid className="w-full h-full flex justify-center">
                    <IonRow className="w-full max-w-lg px-5 flex flex-col h-full">
                        {/* Header Section */}
                        <div className="min-h-[10%] flex items-end py-2 pt-5">
                            <Header title={userName ?? "User"} isBack={true} onBack={() => { newConnection(); history.goBack() }} />
                        </div>

                        {/* Message Section */}
                        <IonCol className="flex-grow overflow-y-auto overflow-x-hidden select-text">
                            {
                                userName && !chatActive ? (
                                    <div className='h-full flex flex-col justify-center items-center'>
                                        <div className="text-center mb-5 flex flex-col items-center">
                                            <div className="bg-[#fff6f2] shadow-lg shadow-[#ffc6b2] rounded-full m-5 px-5 py-3 border-solid border-2 border-[#ff4a0a] border-b-0">
                                                <PiLinkBreakBold className="text-[#ff4a0a] text-5xl " />
                                            </div>
                                            <p className="text-[#ff4a0a] mb-3 font-semibold">{userName ?? "User"} is Disconnected</p>
                                        </div>
                                        <Investors />
                                    </div>
                                ) : (
                                    !messages.length && !userName ? (
                                        <>
                                            <div className='h-full flex items-center justify-center gap-2'>
                                                <Oval
                                                    visible={true}
                                                    height="100"
                                                    width="100"
                                                    strokeWidth={3}
                                                    color="#0f5999"
                                                    secondaryColor="#4dacff"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className='mt-3 p-1'>
                                            {chatActive && <Messages messages={messages} handleFileUpload={handleRequestedPhotoUpload} />}
                                            {isTyping && <TypingIndicator />}
                                            <div ref={chatEndRef} />
                                        </div>
                                    )
                                )
                            }
                        </IonCol>

                        {/* Bottom Section */}
                        <div className={`min-h-[15%] flex flex-col justify-start py-2 ${!messages.length && !userName && 'py-5'}`} >
                            <div className='w-full text-center mb-2'>
                                {
                                    userName && !chatActive ? (
                                        <span className="text-[#0f5999] text-sm bg-[#edf6ff] p-2 rounded-md cursor-pointer font-bold" onClick={() => history.replace('/')}>Go to Home</span>
                                    ) : (
                                        <p className="text-[#0f5999] text-sm bg-[#edf6ff] p-1 rounded-md font-bold">
                                            {!messages.length && !userName ? (
                                                <>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <IonSpinner name="circles" color="secondary" />
                                                        Waiting for connection
                                                    </div>
                                                </>
                                            ) : `Connected to ${userName ?? "User"}`}
                                        </p>
                                    )
                                }
                            </div>

                            <div className={`flex w-full`}>
                                {
                                    [
                                        { isHidden: !userName && !messages.length, onClick: newConnection, title: "New Chat", className: "bg-[#68b2ff]" },
                                        { isHidden: !messages.length, onClick: requestForPhoto, title: "Req Photo", className: "bg-[#a943a0]" },
                                    ].map(({ isHidden, onClick, title, className }) => (
                                        <div className={`w-full p-1 ${isHidden && 'hidden'}`} key={title}>
                                            <IonButton expand="full" fill="clear" size="large" className={`capitalize rounded-2xl text-white text-lg ${className}`} onClick={onClick}>
                                                {title}
                                            </IonButton>
                                        </div>
                                    ))
                                }
                            </div>

                            {
                                chatActive && Boolean(messages.length) && (
                                    <div className='flex w-full p-1'>
                                        <Input
                                            name='message'
                                            itemId='chat-input-box'
                                            placeholder='Enter message...'
                                            value={message}
                                            onIonChange={(e) => setMessage(e.target.value)}
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