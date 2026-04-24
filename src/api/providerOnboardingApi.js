import api from "./axios";

export const getOnboardingStatus = () =>
    api.get("/api/provider/me/onboarding-status");