import fetch from "node-fetch"

let getPostsAndTodos = function (userId) {
    let posts = new Promise(function (resolve) {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(json => {
                resolve(json.filter(post => {
                    return post["userId"] === userId
                }));
            });
    });

    let toDos = new Promise(function (resolve) {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.json())
            .then(json => {
                resolve(json.filter(todo => {
                    return todo["userId"] === userId
                }));
            });
    });

    Promise.all([posts, toDos])
        .then(res => console.log({ posts: res[0], todos: res[1] }));
};

getPostsAndTodos(1);