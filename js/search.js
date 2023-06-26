// async function searchTitleInFirestore(title) {
//     const db = firebase.firestore();
//     const start = performance.now();
//     const searchResult = await db.collection('posts').where('searchIndex', 'array-contains-any', title.split(' ')).get();
//     const end = performance.now();
//     console.log(`Firestore search took ${end - start} milliseconds.`);
//     return searchResult.docs.map(doc => doc.data());
// }

async function searchTitleInFirestore(title) {

    // Check if the user has alerdy searched for this title and no oldern than 1 hour
    if (localStorage.getItem(title) && localStorage.getItem(title + 'timestamp') > Date.now() - 3600000) {
        toast(`Successfull retrieved from database cache.`);
        return JSON.parse(localStorage.getItem(title));
    }

    let query11 = title.split(' ');

    // Make sure the query11 does not have more than 8 items
    if (query11.length > 8) {
        query11 = query11.slice(0, 8);
    }


    const db = firebase.firestore();
    const start = performance.now();
    const searchResult = await db.collection('posts').where('searchIndex', 'array-contains-any', query11).get();
    const end = performance.now();
    toast(`Succesfuly searched database in ${Math.round(end - start)} milliseconds.`);

    // Save the result in the local storage and add a timestamp
    localStorage.setItem(title, JSON.stringify(searchResult.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    localStorage.setItem(title + 'timestamp', Date.now());

    return searchResult.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
