import toast from "react-hot-toast";

// Function to generate a random alphanumeric code of given length
export const generateRandomCode = (length = 15): string => {
    const selectedString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => selectedString[Math.floor(Math.random() * selectedString.length)]).join('');
};

// Function to copy text to clipboard
export const copyToClipboard = (value: string) => {
    // Method - 1
    const tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);

    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Method - 2
    // navigator.clipboard.writeText(value);

    toast.success("Copied to clipboard!", {
        duration: 1500,
        style: { background: "#4dacff", color: "#fff", fontWeight: "bold" },
    });
};