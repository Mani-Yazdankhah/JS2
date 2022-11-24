import fetch from "node-fetch"

let getMostFollowedPosts = async function (userId) {
    let postIdToCommentCount = new Map();
    let postIdtoPost = new Map();
    const postsReq = await fetch('https://jsonplaceholder.typicode.com/posts');
    const commentsReq = await fetch('https://jsonplaceholder.typicode.com/comments');
    (await postsReq.json()).forEach(post => {
        // Find the posts belonging to the provided user ID
        if (post["userId"] === userId) {
            // Set the comment count to zero for each post and keep a reference to it using a map
            // (using a map to store the posts will prevent the need for a third request to convert
            // post IDs to posts later on)
            postIdToCommentCount.set(post["id"], 0);
            postIdtoPost.set(post["id"], post);
        };
    });
    (await commentsReq.json()).forEach(comment => {
        let postId = comment["postId"];
        if (postIdToCommentCount.has(postId)) {
            postIdToCommentCount.set(postId, postIdToCommentCount.get(postId) + 1);
        };
    });
    // Find the maximum number of comments
    let maxCommentCount = Math.max(...postIdToCommentCount.values());
    // Go through all the posts written by the provided user and find all the posts which have
    // the maximum number of comments
    let posts = [];
    for (const [id, count] of postIdToCommentCount) {
        if (count == maxCommentCount) {
            // Convert a post ID to an actual post using the map we made earlier (saves us from
            // using a third request)
            posts.push(postIdtoPost.get(id));
        };
    };
    return posts;
};

let getMostActiveUsers = async function () {
    let userIdtoPostCount = new Map();
    let mostActiveUserIds = new Set();
    const postsReq = await fetch('https://jsonplaceholder.typicode.com/posts');
    const usersReq = await fetch('https://jsonplaceholder.typicode.com/users');
    // Go through all the posts and count how many posts each user has
    (await postsReq.json()).forEach(post => {
        let userId = post["userId"];
        if (userIdtoPostCount.has(userId)) {
            userIdtoPostCount.set(userId, userIdtoPostCount.get(userId) + 1);
        } else {
            userIdtoPostCount.set(userId, 0);
        };
        // Find the maximum number of posts
        let maxPostCount = Math.max(...userIdtoPostCount.values());
        // Find all the users which have the maximum number of posts and store their IDs in a set
        for (const [id, count] of userIdtoPostCount) {
            if (count == maxPostCount) {
                mostActiveUserIds.add(id);
            };
        };
    });
    return ((await usersReq.json()).filter(user => {
        return mostActiveUserIds.has(user["id"]);
    }));
};

let getUsersWithOpenTasks = async function () {
    let userIds = new Set();
    const todosReq = await fetch('https://jsonplaceholder.typicode.com/todos');
    const usersReq = await fetch('https://jsonplaceholder.typicode.com/users');
    // Go through the to do list and keep track of user IDs with open tasks
    (await todosReq.json()).forEach(todo => {
        userIds.add(todo["userId"]);
    });
    // Filter out the users whose IDs match the users with open tasks
    return ((await usersReq.json()).filter(user => {
        return userIds.has(user["id"]);
    }));
};

console.log("Posts from user with the the specified ID, which have the most comments:");
console.log(await getMostFollowedPosts(1));

console.log("Users with most posts:");
console.log(await getMostActiveUsers());

console.log("Users with open tasks:");
console.log(await getUsersWithOpenTasks());