import { loadEnvConfig } from '@next/env';
import { resolve } from 'path';

// Load env vars
loadEnvConfig(process.cwd());

import { Resend } from 'resend';

async function test() {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const defaultFrom = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    console.log("Using from:", defaultFrom);

    try {
        const { data, error } = await resend.emails.send({
            from: defaultFrom,
            to: 'aielenterprises3321@gmail.com',
            subject: 'Test email for stellathesuccess@gmail.com from Aiel Enterprises (Resend)',
            html: '<p>This is a test email sent from the Aiel Enterprises development environment using Resend via Node.</p>'
        });

        if (error) {
            console.error("Resend error object:", error);
        } else {
            console.log("Success:", data);
        }
    } catch (error) {
        console.error("Caught error:", error.message);
    }
}

test();
