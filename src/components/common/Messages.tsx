import React from "react";
import { Message } from "../../utility/Types";
import UploadFiles from "./UploadFiles";

const getMessage = (message?: string): [string?, boolean?] => {
    switch (message) {
        case "photo_request":
            return ["Photo Request", true];
        default:
            return [message, false];
    }
}

function Messages({ messages, handleFileUpload }: { messages: Array<Message>, handleFileUpload: Function }) {
    return (
        <React.Fragment>
            {
                messages.map((message: Message, index: number) => {

                    const [newMessage, isKey] = getMessage(message.text);
                    return (
                        <React.Fragment>
                            <div key={index} className={`flex items-center mb-3 ${!message.sender ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-center ${!message.sender && 'flex-row-reverse'}`}>
                                    <div className={`flex flex-col ${!message.sender ? 'items-end' : 'items-start'}`}>
                                        <p className={`chat-message text-[#0f5999] text-wrap text-sm py-3 px-5 rounded-3xl font-semibold text-justify ${!message.sender ? 'text-white bg-[#4dacff] rounded-br-md' : 'bg-[#e5f2ff] rounded-bl-md'}`}>
                                            {
                                                (newMessage?.startsWith('data:') && newMessage?.includes('image') && newMessage?.includes('base64')) ?
                                                    (
                                                        <img src={newMessage} alt="Image" className="rounded-3xl" />
                                                    )
                                                    :
                                                    newMessage
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {
                                isKey && message.text === "photo_request" && (
                                    message?.receiveImage
                                        ?
                                        (
                                            <div className={`my-3 flex items-center ${message.sender ? 'justify-end' : 'justify-start'}`}>
                                                <p className={`chat-message text-[#0f5999] text-wrap text-sm py-3 px-5 rounded-3xl font-semibold text-justify ${message.sender ? 'bg-[#4dacff] rounded-br-md' : 'bg-[#e5f2ff] rounded-bl-md'}`}>
                                                    <img src={message?.receiveImage} alt="Image" className="rounded-3xl" />
                                                </p>
                                            </div>
                                        )
                                        : message.sender && (
                                            <div className="my-3 flex items-center justify-start border-2 border-[#0f5999] w-1/2 rounded-xl">
                                                <UploadFiles onFileUpload={(image) => handleFileUpload(image, message?.id)} maxSize={5} />
                                            </div>
                                        )
                                )
                            }
                        </React.Fragment>
                    )
                })
            }
        </React.Fragment>
    )
}

export default Messages