const API_BASE = "http://localhost:8080";
const BASE_URL = "http://localhost:8080";

async function runTest() {
    try {
        console.log("Logging in Admin...");
        const adminRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "ranithaaravichandran@gmail.com", password: "ranitha28!" })
        });
        if(!adminRes.ok) {
            console.error("Admin login failed", await adminRes.text());
            return;
        }
        const adminData = await adminRes.json();
        const adminToken = adminData.token;
        console.log("Admin Token: OK");

        console.log("Creating Auction as Admin...");
        const endTime = new Date(Date.now() + 65 * 1000).toISOString(); // 65 seconds from now
        const auctionRes = await fetch(`${API_BASE}/auctions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                title: "Test Email Trigger Final",
                description: "Testing end-to-end email triggering",
                basePrice: 5.0,
                startDateTime: new Date().toISOString(),
                endDateTime: endTime
            })
        });
        
        let auctionText = await auctionRes.text();
        if(!auctionRes.ok) {
            console.log("Create Auction Status: " + auctionRes.status);
            console.log("Create Auction Response: " + auctionText);
            return;
        }
        
        const auctionId = JSON.parse(auctionText).data.id;
        console.log(`Auction Created with ID: ${auctionId}`);

        console.log("Approving Auction...");
        const approveRes = await fetch(`${API_BASE}/admin/auctions/${auctionId}/approve`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${adminToken}`
            }
        });
        if(!approveRes.ok) {
            console.error("Failed to approve auction", await approveRes.text());
            return;
        }
        console.log("Auction Approved.");

        console.log("Registering Bidder...");
        const bidderEmail = "bidder_test" + Date.now() + "@test.com"; // Unique email!
        let res2 = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: "Bidder", lastName: "Test", email: bidderEmail, password: "password123", phoneNumber: "1234567890" })
        });
        if (!res2.ok) {
            console.error("Bidder registration failed:", await res2.text());
            return;
        }
        const bidderData = await res2.json();
        const bidderToken = bidderData.token;
        console.log("Bidder Token: OK");

        console.log("Placing Bid...");
        const bidRes = await fetch(`${API_BASE}/bids`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bidderToken}`
            },
            body: JSON.stringify({
                auctionId: auctionId,
                amount: 15.0
            })
        });
        
        if(!bidRes.ok) {
            console.error("Failed to place bid", await bidRes.text());
            return;
        }
        console.log("Bid placed successfully.");
        console.log("All done! Wait ~65 seconds.");

    } catch (e) {
        console.error(e);
    }
}

runTest();
