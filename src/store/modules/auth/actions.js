const ACCOUNTS_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

export default {
  async login(context, payload) {
    const response = await fetch(
      `${ACCOUNTS_URL}:signInWithPassword?key=${process.env.VUE_APP_AUTH_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to login.");
    }

    const responseData = await response.json();
    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn,
    });
  },
  async signup(context, payload) {
    const response = await fetch(
      `${ACCOUNTS_URL}:signUp?key=${process.env.VUE_APP_AUTH_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to signup.");
    }

    const responseData = await response.json();
    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn,
    });
  },
  logout(context) {
    context.commit("setUser", {
      userId: null,
      token: null,
      tokenExpiration: null,
    });
  },
};
