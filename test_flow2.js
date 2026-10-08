const API_BASE = "http://localhost:8080/api";
const BASE_URL = "http://localhost:8080";

async function runTest() {
    try {
        console.log("Registering/Logging in Seller...");
        let sellerEmail = "seller_test2@test.com";
        let res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: "Seller", lastName: "Test", email: sellerEmail, password: "password123", phoneNumber: "1234567890" })
        });
        if (!res.ok) {
            res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: sellerEmail, password: "password123" })
            });
        }
        const sellerData = await res.json();
        const sellerToken = sellerData.token;

        console.log("Registering/Logging in Bidder...");
        let bidderEmail = "bidder_test2@test.com";
        let res2 = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: "Bidder", lastName: "Test", email: bidderEmail, password: "password123", phoneNumber: "1234567890" })
        });
        if (!res2.ok) {
            res2 = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: bidderEmail, password: "password123" })
            });
        }
        const bidderData = await res2.json();
        const bidderToken = bidderData.token;

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


        console.log("Creating Auction...");
        const endTime = new Date(Date.now() + 80 * 1000).toISOString(); // 80 seconds from now
        const auctionRes = await fetch(`${API_BASE}/auctions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sellerToken}`
            },
            body: JSON.stringify({
                title: "Test Email Trigger Auction With Bid",
                description: "Testing end-to-end email triggering with successful bid",
                basePrice: 50.0,
                startDateTime: new Date().toISOString(),
                endDateTime: endTime
            })
        });
        
        if(!auctionRes.ok) {
            console.error("Failed to create auction", await auctionRes.text());
            return;
        }
        
        const auction = await auctionRes.json();
        console.log(`Auction Created with ID: ${auction.id}`);

        console.log("Approving Auction...");
        const approveRes = await fetch(`${API_BASE}/admin/auctions/${auction.id}/approve`, {
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

        console.log("Placing Bid...");
        const bidRes = await fetch(`${API_BASE}/bids`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bidderToken}`
            },
            body: JSON.stringify({
                auctionId: auction.id,
                amount: 60.0
            })
        });
        if(!bidRes.ok) {
            console.error("Failed to place bid", await bidRes.text());
            return;
        }
        console.log("Bid placed successfully.");
        console.log("All setup done! Wait ~80 seconds for scheduler to trigger emails.");

    } catch (e) {
        console.error(e);
    }
}

runTest();
