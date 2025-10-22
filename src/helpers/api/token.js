export const TokenKeyAuth = JSON.parse(localStorage.getItem("auth"));

export const getAccessToken = () => {
    const TokenKeyAuth_curent = JSON.parse(localStorage.getItem("auth"));
    if (!TokenKeyAuth_curent) return "";
    return `Bearer ${TokenKeyAuth_curent}`
}