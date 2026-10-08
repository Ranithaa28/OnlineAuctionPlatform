const API_BASE = "http://localhost:8080/api";
const BASE_URL = "http://localhost:8080";

async function runTest() {
    try {
        console.log("Registering Seller...");
        let res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: "Seller", lastName: "Test", email: "seller_test1@test.com", password: "password123", phoneNumber: "1234567890" })
        });
        if (res.status === 400) {
            res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: "seller_test1@test.com", password: "password123" })
            });
        }
        const sellerData = await res.json();
        const sellerToken = sellerData.token;

        console.log("Registering Bidder...");
        let res2 = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: "Bidder", lastName: "Test", email: "bidder_test1@test.com", password: "password123", phoneNumber: "1234567890" })
        });
        if (res2.status === 400) {
            res2 = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: "bidder_test1@test.com", password: "password123" })
            });
        }
        const bidderData = await res2.json();
        const bidderToken = bidderData.token;

        console.log("Creating Auction...");
        const endTime = new Date(Date.now() + 60 * 1000).toISOString(); // 1 minute from now
        const auctionRes = await fetch(`${API_BASE}/auctions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sellerToken}`
            },
            body: JSON.stringify({
                title: "Test Email Trigger Auction",
                description: "Testing end-to-end email triggering",
                basePrice: 50.0,
                startDateTime: new Date().toISOString(),
                endDateTime: endTime
            })
        });
        
        if(!auctionRes.ok) {
            console.log(await auctionRes.text());
            return;
        }
        
        const auction = await auctionRes.json();
        console.log(`Auction Created with ID: ${auction.id}`);

        console.log("Approving Auction (Admin action)... simulating via DB script or assuming admin token. Let's just use another script to DB approve it.");
        
        console.log(JSON.stringify({auctionId: auction.id, bidderToken}));
    } catch (e) {
        console.error(e);
    }
}

runTest();
