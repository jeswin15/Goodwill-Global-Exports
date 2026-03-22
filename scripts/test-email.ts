
import { sendContactEmail } from "../server/email";
import "dotenv/config";

async function test() {
    console.log("Starting email test...");
    try {
        await sendContactEmail({
            name: "Test User",
            email: "jeswinalbert15@gmail.com", // Send to self to verify
            message: "This is a test message from the debugging script."
        });
        console.log("✅ Test email sent successfully!");
    } catch (error) {
        console.error("❌ Test email failed:", error);
    }
}

test();
