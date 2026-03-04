export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    const url = `${process.env.VUE_APP_FIRE_BASE_URL}/coaches/${userId}.json`;
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(coachData),
    });
    if (!response.ok) {
      throw new Error("Failed to register coach");
    }
    // const responseData = await response.json();
    context.commit("registerCoach", { ...coachData, id: userId });
  },
  async loadCoaches(context, payload) {
    if (!payload?.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }

    const url = `${process.env.VUE_APP_FIRE_BASE_URL}/coaches.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load coaches");
    }
    const responseData = await response.json();
    const coaches = [];
    for (const key in responseData) {
      const coach = { id: key, ...responseData[key] };
      coaches.push(coach);
    }
    context.commit("setCoaches", coaches);
    context.commit("setFetchTimestamp");
  },
};
