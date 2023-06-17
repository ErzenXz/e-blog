// Function to track and log errors
function trackError(error) {
    console.log("Test");
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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Get page information
    var currentPage = {
        url: window.location.href,
        title: document.title,
        path: window.location.pathname,
        referrer: document.referrer,
    };

    // Get error stack trace
    var errorStack = "test";//error.stack ? error.stack.split('\n') : [];

    // Create error data object
    var errorData = {
        userId: userId,
        errorMessage: "test",
        errorStack: errorStack,
        browserInfo: browserInfo,
        currentPage: currentPage,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        cookies: document.cookie,
        localStorage: window.localStorage,
        screenDimensions: {
            width: window.screen.width,
            height: window.screen.height,
        },
        networkInformation: {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
        },
        geolocation: navigator.geolocation.getCurrentPosition,
        userAgent: window.navigator.userAgent,
        performanceTiming: window.performance.timing,
        requestURL: window.location.href,
    };

    // Save error data to Firebase Firestore
    var db = firebase.firestore();
    db.collection('analytics_errors').add(errorData)
        .then(function (docRef) {
            console.log('Succesfully reported error! ', docRef.id);
        })
        .catch(function (error) {
            console.error('Error reporting error: ', error);
        });
}