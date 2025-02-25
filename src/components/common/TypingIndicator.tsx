const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center gap-1 p-4 bg-[#4dacff] w-fit rounded-3xl rounded-bl-md">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0s]"></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
    );
};

export default TypingIndicator;
