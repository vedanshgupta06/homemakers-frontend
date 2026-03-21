import api from "./axios";

export const getWalletBalance = async () => {
    const res = await api.get("/api/user/wallet/balance");
    return res.data;
};

export const getWalletTransactions = async () => {
    const res = await api.get("/api/user/wallet/transactions");
    return res.data;
};