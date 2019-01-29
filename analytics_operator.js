
class AnalyticsEventTrackingOperator {
    constructor() {}

    async eventTracking(command) {
        // hands off command to another operator which hands it off to another operator etc...
        
        // return Promise for the new job
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // eventually we get the new job
                const job = {
                    account_id: command.account_id,
                    topic: 'forge-event',
                    msg_type: 'job-created',
                    created_by: 'system',
                    job_id: 4324, // not a string, which is what the schema wants, so it gets converted into a string
                    process_status: {
                        status: 'fdsf', // not a number, which is what the schema wants, so it gets converted to 0
                        display: 'Queued'
                    }
                }
                resolve(job);
            }, 2000);
        });
    }
}

module.exports = AnalyticsEventTrackingOperator;