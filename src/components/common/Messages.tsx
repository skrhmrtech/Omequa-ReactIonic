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

const checkIsImage = (image: string = ''): boolean => {
    return image?.startsWith('data:') && image?.includes('image') && image?.includes('base64');
}

function Messages({ messages, handleFileUpload }: { messages: Array<Message>, handleFileUpload: Function }) {
    return (
        <React.Fragment>
            {
                messages.map((message: Message, index: number) => {

                    const [newMessage, isKey] = getMessage(message.text);
                    const receiveImage = message?.receiveImage || '';

                    const isImage = checkIsImage(newMessage);
                    const isReceiveImage = checkIsImage(receiveImage);

                    return (
                        <React.Fragment key={index}>
                            <div className={`flex items-center mb-3 ${!message.sender ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-center ${!message.sender && 'flex-row-reverse'}`}>
                                    <div className={`w-100 flex flex-col ${!message.sender ? 'items-end' : 'items-start'}`}>
                                        <p className={`max-w-80 chat-message text-[#0f5999] text-wrap text-sm ${isImage ? 'p-3' : 'py-3 px-5'} rounded-3xl font-semibold text-justify ${!message.sender ? 'text-white bg-[#4dacff] rounded-br-md' : 'bg-[#e5f2ff] rounded-bl-md'}`}>
                                            {isImage ? <img src={newMessage} alt="Image" className="rounded-3xl" /> : newMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {
                                isKey && message.text === "photo_request" && (
                                    isReceiveImage ? (
                                        <div className={`my-3 w-100 flex items-center ${message.sender ? 'justify-end' : 'justify-start'}`}>
                                            <p className={`max-w-80 chat-message text-[#0f5999] text-wrap text-sm p-3 rounded-3xl font-semibold text-justify ${message.sender ? 'bg-[#4dacff] rounded-br-md' : 'bg-[#e5f2ff] rounded-bl-md'}`}>
                                                <img src={receiveImage} alt="Image" className="rounded-3xl" />
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={`my-3 flex items-center ${message.sender ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`w-1/2 border-solid border-2 border-[#0f5999] rounded-xl ${!message.sender && 'opacity-50'}`}>
                                                <UploadFiles disabled={!message.sender} onFileUpload={(image) => handleFileUpload(image, message?.id)} maxSize={5} />
                                            </div>
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