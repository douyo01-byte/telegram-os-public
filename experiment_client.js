(function () {
  var EC_BASE = "https://openclaw-fortune-order.openclaw-fortune.workers.dev";
  var EXPERIMENT_ID = 1;
  var assigned = null;

  function getSessionId() {
    var k = "oc_ec_session_id";
    var v = localStorage.getItem(k);
    if (!v) {
      v = "s_" + Math.random().toString(36).slice(2) + Date.now();
      localStorage.setItem(k, v);
    }
    return v;
  }

  function getUserId() {
    var k = "oc_ec_user_id";
    var v = localStorage.getItem(k);
    if (!v) {
      v = "u_" + Math.random().toString(36).slice(2) + Date.now();
      localStorage.setItem(k, v);
    }
    return v;
  }

  function post(path, body) {
    return fetch(EC_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  function assignAndTrack() {
    var userId = getUserId();
    var sessionId = getSessionId();

    fetch(
      EC_BASE + "/experiments/" + EXPERIMENT_ID + "/assign?user_id=" +
      encodeURIComponent(userId) + "&session_id=" + encodeURIComponent(sessionId),
      { method: "POST" }
    )
    .then(function (r) { return r.json(); })
    .then(function (res) {
      assigned = res.variant_id || "A";
      document.documentElement.setAttribute("data-exp-variant", assigned);

      return post("/events", {
        experiment_id: EXPERIMENT_ID,
        variant_id: assigned,
        user_id: userId,
        session_id: sessionId,
        event_type: "impression",
        value: 0
      });
    })
    .catch(function (e) {
      console.log("experiment assign/impression failed", e);
    });
  }

  function trackConversion() {
    if (!assigned) return;
    var userId = getUserId();
    var sessionId = getSessionId();

    post("/events", {
      experiment_id: EXPERIMENT_ID,
      variant_id: assigned,
      user_id: userId,
      session_id: sessionId,
      event_type: "conversion",
      value: 1
    }).catch(function (e) {
      console.log("experiment conversion failed", e);
    });
  }

  window.ocTrackConversion = trackConversion;
  assignAndTrack();
})();
