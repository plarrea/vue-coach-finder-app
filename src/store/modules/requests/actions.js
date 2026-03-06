export default {
  async contactCoach(context, payload) {
    const newRequest = {
      // coachId: payload.coachId,
      userEmail: payload.email,
      message: payload.message,
    };
    const url = `${process.env.VUE_APP_FIRE_BASE_URL}/requests/${payload.coachId}.json`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newRequest),
    });
    if (!response.ok) {
      throw new Error("Failed to send request.");
    }
    const responseData = await response.json();
    newRequest.id = responseData.name;
    newRequest.coachId = payload.coachId;
    context.commit("addRequest", newRequest);
  },
  async loadRequests(context) {
    const coachId = context.rootGetters.userId;
    const token = context.rootGetters.token;
    const url = `${process.env.VUE_APP_FIRE_BASE_URL}/requests/${coachId}.json?auth=${token}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load requests");
    }
    const responseData = await response.json();
    const requests = [];
    for (const key in responseData) {
      const request = { id: key, coachId, ...responseData[key] };
      requests.push(request);
    }
    context.commit("setRequests", requests);
  },
};
