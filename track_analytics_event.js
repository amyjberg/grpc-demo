

class TrackAnalyticsEvent {
    constructor(accountId, analyticsEvent = null, fingerprint = null) {
        this.account_id = accountId;
    }
}

module.exports = TrackAnalyticsEvent;