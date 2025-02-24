import toast from "react-hot-toast";

// Function to generate a Secret Code
export const generateSecretCode = () => {
    const storedCode = localStorage.getItem("SecretCode");
    const storedTimestamp = localStorage.getItem("SecretCodeTimestamp");

    // Get today's 7 AM timestamp
    const today7AM = new Date();
    today7AM.setHours(7, 0, 0, 0);
    const today7AMTimestamp = today7AM.getTime();

    // If timestamp exists and it's still the same day before 7 AM, return existing code
    if (storedCode && storedTimestamp && Number(storedTimestamp) >= today7AMTimestamp) {
        return storedCode;
    }

    // Generate a new secret code
    const newCode = generateRandomCode();
    localStorage.setItem("SecretCode", newCode);
    localStorage.setItem("SecretCodeTimestamp", new Date().getTime().toString());

    return newCode;
};

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