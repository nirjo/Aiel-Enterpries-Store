require('@next/env').loadEnvConfig(process.cwd());
const { Resend } = require('resend');
async function test() {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const defaultFrom = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    console.log('Using from:', defaultFrom);
    try {
        const { data, error } = await resend.emails.send({
            from: defaultFrom,
            to: 'aielenterprises1@gmail.com',
            subject: 'Test email from Aiel Enterprises (Resend)',
            html: '<p>This is a test email sent from the Aiel Enterprises development environment using Resend via Node CJS.</p>'
        });
        if (error) {
            console.error('Resend error object:', error);
        } else {
            console.log('Success:', data);
        }
    } catch (error) {
        console.error('Caught error:', error.message);
    }
}
test();
