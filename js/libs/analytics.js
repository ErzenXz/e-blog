function trackAnalyticsData() {

    // Get user information
    var user = firebase.auth().currentUser;
    var userId = user ? user.uid : 'anonymous';

    // Get browser information
    var browserInfo = {
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
        platform: window.navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
    };

    // Get page information
    var currentPage = window.location.href;
    var previousPage = document.referrer;

    let urlKey = extractPostKeyFromURL(currentPage);

    if (urlKey != null && urlKey != undefined && urlKey != "" && urlKey != " " && urlKey != currentPost) {
        urlKey = urlKey;
    } else {
        urlKey = "homepage";
    }


    // Get user IP (using a third-party service)
    var ipAddress = '';

    fetch('https://api.ipify.org/?format=json')
        .then((response) => response.json())
        .then((data) => {
            ipAddress = data.ip;

            // Create analytics data object
            var analyticsData = {
                userId: userId,
                ipAddress: ipAddress,
                browserInfo: browserInfo,
                currentPage: currentPage,
                previousPage: previousPage,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                post: urlKey
            };

            // Save analytics data to Firebase Firestore
            var db = firebase.firestore();
            db.collection('analytics').add(analyticsData)
                .then(function (docRef) {
                    //console.log('Analytics data added with ID: ', docRef.id);
                    b = true;
                })
                .catch(function (error) {
                    //console.error('Error adding analytics data: ', error);
                });
        })
        .catch(function (error) {
            console.error('Error getting user IP: ', error);
        });
}

function extractPostKeyFromURL(url) {
    const regex = /\/post\/([^/?#]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        return "";
    }
}

trackAnalyticsData();