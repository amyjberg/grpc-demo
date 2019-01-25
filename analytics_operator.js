
class AnalyticsEventTrackingOperator {
    constructor() {
    }

    async eventTracking(command) {
        console.log('analytics operator called!');
        // pretend that we send off the job here...

        const job = {
            account_id: command.account_id,
            topic: 'forge-event',
            msg_type: 'job-created',
            created_by: 'system',
            job_id: 4324, // not a string, which is what the schema wants, so it gets converted into a string
            process_status: {
                status: 'fdsf', // not a number, which is what the schema wants, so it gets converted to 0...
                display: 'Queued'
            }
        }


        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(job);
            }, 2000);
        });
    }
}

module.exports = AnalyticsEventTrackingOperator;