const express = require('express');
const fs = require('fs');
// const bodyParser = require('body-parser');

let app = express();
let books = JSON.parse(fs.readFileSync('./data/books.json'));

app.get('/api/v1/books', (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            books: books
        }
    });
});


app.get('/api/v1/books/:ISBN', (req, res) => {
    const book = books.find(p => p.ISBN === parseInt(req.params.ISBN))
    res.status(200).json({
        status: "success",
        data: {
            books: book
        }
    });
});


app.get('/api/v1/books/author/:author', (req, res) => {
    const booksByAuthor = books.filter(p => p.author === req.params.author)
    res.status(200).json({
        status: "success",
        data: {
            books: booksByAuthor
        }
    });
});



// regitsration process start here

// app.use(bodyParser.json());

// let users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username ||  !password) {
        return res.status(400).json({
            status: 'error',
            message: 'please provide appropriate credentials'
        })
    }

    // if (users.some(user => user.username === username || user.email === email)) {
    //     return res.status(409).json({
    //         status: 'error',
    //         message: 'Username or email already exists.'
    //     });
    // }


    const newUser = {
        username,
        password
    };

    users.push(newUser);

    return res.status(201).json({
        status: 'success',
        message: 'user registered successfully',
        data: {
            user: newUser
        }
    })
})


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the required fields are present
    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Username and password are required fields.'
        });
    }

    // Find the user in the in-memory storage
    const user = users.find(u => u.username === username);

    // Check if the user exists and if the provided password matches
    if (!user || user.password !== password) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid username or password.'
        });
    }

    return res.status(200).json({
        status: 'success',
        message: 'Login successful.',
        data: {
            user: {
                username: user.username,
                email: user.email
                // Do not include sensitive information in the response in a real app
            }
        }
    });
});

app.delete('/api/v1/books/:ISBN', (req, res) => {
    const ISBN = parseInt(req.params.ISBN);

    const bookIndex = books.findIndex(p => p.ISBN === ISBN);

    if (bookIndex === -1) {
        return res.status(404).json({
            status: "fail",
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    fs.writeFileSync('./data/books.json', JSON.stringify(books, null, 2));

    res.status(200).json({
        status: "success",
        data: {
            book: deletedBook
        }
    });
});






const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
