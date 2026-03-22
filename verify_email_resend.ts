
async function testEmail() {
    try {
        console.log("Sending test email request (Contact) via Resend...");
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Resend Test User',
                email: 'jeswinalbert15@gmail.com',
                message: 'This is a test message to verify the migration to Resend API.'
            })
        });

        const data = await response.json();
        console.log('Contact Status Code:', response.status);
        console.log('Contact Response Body:', data);
    } catch (error) {
        console.error('Contact Request Failed:', error);
    }
}

async function testQuote() {
    try {
        console.log("\nSending test email request (Quote) via Resend...");
        const response = await fetch('http://localhost:5000/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyName: 'Resend Test Company',
                contactPerson: 'Resend Agent',
                email: 'jeswinalbert15@gmail.com',
                phone: '1234567890',
                country: 'Testland',
                productInterest: 'Test Product',
                estimatedQuantity: '100',
                frequency: 'One-time'
            })
        });

        const data = await response.json();
        console.log('Quote Status Code:', response.status);
        console.log('Quote Response Body:', data);
    } catch (error) {
        console.error('Quote Request Failed:', error);
    }
}

async function runTests() {
    await testEmail();
    await testQuote();
}

runTests();
