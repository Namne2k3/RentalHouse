export const formatPhoneNumber = (phoneNumber: string | undefined) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phoneNumber;
};