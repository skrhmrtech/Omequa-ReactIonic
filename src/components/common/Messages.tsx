import React from "react";
import { Message } from "../../utility/Types";

function Messages({ messages }: { messages: Array<Message> }) {
    return (
        <React.Fragment>
            {
                messages.map((message: Message, index: number) => (
                    <div key={index} className={`flex items-center mb-3 ${!message.sender ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-center ${!message.sender && 'flex-row-reverse'}`}>
                            <div className={`flex flex-col ${!message.sender ? 'items-end' : 'items-start'}`}>
                                <p className={`chat-message text-[#0f5999] text-wrap text-sm py-3 px-5 rounded-3xl font-semibold text-justify ${!message.sender ? 'text-white bg-[#4dacff] rounded-br-md' : 'bg-[#e5f2ff] rounded-bl-md'}`}>
                                    {
                                        (message.text?.startsWith('data:') && message.text?.includes('image') && message.text?.includes('base64')) ?
                                            (
                                                <img src={message.text} alt="Image" className="rounded-3xl" />
                                            )
                                            :
                                            message.text
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </React.Fragment>
    )
}

export default Messages