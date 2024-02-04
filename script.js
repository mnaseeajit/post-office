


document.addEventListener("DOMContentLoaded", function () {
    // Your async/await code here
    (async function () {
        try {
            // Step 1: Get user's IP address on page load
            const data = await fetch("https://api.ipify.org?format=json");
            const { ip: userIP } = await data.json();
            document.getElementById("user-ip").textContent = `Your IP Address: ${userIP}`;

            // Step 2: On button click, retrieve information from the API
            document.getElementById("get-info-btn").addEventListener("click", async function () {
                document.querySelector(".user-info").style.display = "none"; // Hide user information
                document.querySelector("#second").style.display = "block";

                // Step 3: Hit API request with user's IP
                try {
                    const response = await fetch(`https://ipapi.co/${userIP}/json/`);
                    const userInfo = await response.json();

                    console.log(userInfo);

                    // Your HTML manipulation code here
                    document.getElementById("nextPage").innerHTML = `<table>
                        <tr><td>IP Address: ${userInfo.ip}</td></tr>
                        <tr><td>lat: ${userInfo.latitude}</td>
                        <td>long: ${userInfo.longitude}</td>
                        <td>City: ${userInfo.city}</td></tr>
                        <tr><td>Region: ${userInfo.region}</td>
                        <td>Organisation: ${userInfo.org}</td>
                        <td>HostName: ${userInfo.asn}</td></tr>
                    </table>`;

                    document.getElementById("more-info").innerHTML = `<h3>More Information About you</h3>
                        <p>Time Zone: ${userInfo.timezone}</p>
                        <p>Date and Time: ${new Date()}</p>
                        <p>Pincode: ${userInfo.postal}</p>`;

                    // Step 4: Show user's location on Google Maps
                    const { latitude, longitude } = userInfo;
                    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;
                    document.getElementById("google-map").src = mapUrl;

                    // Step 5: Get and display timezone information
                    // const userTimezone = userInfo.timezone;
                    // document.getElementById("user-timezone").textContent = `Your Timezone: ${userTimezone}`;

                    // Step 6: Get post offices in the area
                    const userPincode = userInfo.postal;
                    try {
                        const postOffices = await fetch(`https://api.postalpincode.in/pincode/${userPincode}`);
                        const postOfficesData = await postOffices.json();

                        // Step 7: Display post offices with search functionality
                        const postOfficesList = document.getElementById("post-offices-list");
                        postOfficesList.innerHTML = "";
                        postOfficesData[0].PostOffice.forEach(postOffice => {
                            console.log(postOffice);
                            postOfficesList.innerHTML += `<li>
                                <p>Name: ${postOffice.Name}</p>
                                <p>Branch Type: ${postOffice.BranchType}</p>
                                <p>Delivery Status: ${postOffice.Region}</p>
                                <p>District: ${postOffice.District}</p>
                                <p>Division: ${postOffice.Division}</p>
                            </li>`;
                        });

                        // Step 8: Add event listener on the search input
                        const searchBox = document.getElementById("search-box");
                        searchBox.addEventListener("input", function () {
                            const searchTerm = searchBox.value.toLowerCase();
                            const filteredPostOffices = postOfficesData[0].PostOffice.filter(postOffice => {
                                return (
                                    postOffice.Name.toLowerCase().includes(searchTerm) ||
                                    postOffice.BranchType.toLowerCase().includes(searchTerm)
                                );
                            });

                            // Display filtered post offices
                            postOfficesList.innerHTML = "";
                            filteredPostOffices.forEach(postOffice => {
                                postOfficesList.innerHTML += `<li>
                                    <p>Name: ${postOffice.Name}</p>
                                    <p>Branch Type: ${postOffice.BranchType}</p>
                                    <p>Delivery Status: ${postOffice.Region}</p>
                                    <p>District: ${postOffice.District}</p>
                                    <p>Division: ${postOffice.Division}</p>
                                </li>`;
                            });
                        });

                    } catch (postOfficeError) {
                        console.error("Error fetching post offices", postOfficeError);
                    }
                } catch (userInfoError) {
                    console.error("Error fetching user information", userInfoError);
                }
            });

        } catch (ipError) {
            console.error("Error fetching user IP address", ipError);
        }
    })();
});
