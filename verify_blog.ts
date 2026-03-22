
async function testCreateBlog() {
    try {
        console.log("Testing POST /api/blogs...");

        const blogData = {
            id: Date.now(), // Frontend sends this
            title: "Test Blog Post",
            content: "This is a test blog post content.",
            image: "data:image/png;base64," + "A".repeat(1024 * 1024 * 5), // 5MB image
            date: new Date().toLocaleDateString() // Frontend sends this
        };

        const response = await fetch('http://localhost:5000/api/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData)
        });

        const data = await response.json();
        console.log('Status Code:', response.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Request Failed:', error);
    }
}

testCreateBlog();
