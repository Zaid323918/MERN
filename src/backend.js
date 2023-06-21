var express = require('express');
var mongoose = require("mongoose");
var app = express();

mongoose.connect("mongodb+srv://zaid3:testing12345@cluster0.xs0qsl4.mongodb.net/?retryWrites=true&w=majority"); 
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "MongoDB connection error:"));
connection.once("open", function() { console.log("connected"); });

const librarySchema = new mongoose.Schema ({
    id: String,
    title: String,
    author: String,
    publisher: String,
    isbn: String,
    avail: Boolean,
    who: String,
    due: String
  });

const Library = mongoose.model('Library', librarySchema);

var booklist = [
    {id: "1", title: "Reactions in REACT", author: "Ben Dover", publisher: "Random House", isbn: "978-3-16-148410-0", avail: false, who: "Jen", due: "2/15/23"},
    {id: "2", title: "Express-sions", author: "Frieda Livery", publisher: "Chaotic House", isbn: "978-3-16-148410-2", avail: true, who: "", due: ""},
    {id: "3", title: "Restful REST", author: "Al Gorithm", publisher: "ACM", isbn: "978-3-16-143310-1", avail: true, who: "", due: ""},
    {id: "4", title: "See Essess", author: "Anna Log", publisher: "O'Reilly", isbn: "987-6-54-148220-1", avail: true, who: "", due: ""},
    {id: "5", title: "Scripting in JS", author: "Dee Gital", publisher: "IEEE", isbn: "987-6-54-321123-1", avail: true, who: "", due: ""},
    {id: "6", title: "Be An HTML Hero", author: "Jen Neric", publisher: "Coders-R-Us", isbn: "987-6-54-321123-2", avail: false, who: "Lisa", due: "1/3/23"},
    {id: "7", title: "An Ode to Node", author: "Steve Scripty", publisher: "MERN", isbn: "987-6-28-321137-2", avail: true, who: "", due: ""},
    {id: "8", title: "Inspector DOM", author: "Simple Sim", publisher: "Liberty Hill", isbn: "987-1-07-324278-7", avail: false, who: "Buklu", due: "7/28/23"},
    {id: "9", title: "Lame Postman", author: "Stewie Soup", publisher: "USPS", isbn: "937-6-54-927113-4", avail: false, who: "Jackery", due: "5/31/23"},
    {id: "10", title: "HTTPS for Noobs", author: "Doctor Knowitall", publisher: "Ignorant Inc.", isbn: "948-2-31-148410-8", avail: true, who: "", due: ""},
    {id: "11", title: "Stuck in a Web", author: "Depressed Programmer", publisher: "IDC", isbn: "991-4-28-682510-1", avail: false, who: "Denny", due: "3/3/23"},
  ];

booklist.forEach(async book => {
    var check = await Library.findOne({id: book.id});
    if (!check) {
        var newBook = new Library(book);
        newBook.save();
    }
});

app.use(express.json())
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 
    'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 
        'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
});

app.get('/books', async function(req, res){
    let send_list = await Library.find().lean();
    res.status(200); 
    res.send(JSON.stringify(send_list));
});

app.put('/books/:id', async function(req, res){
    let book_id = await Library.findOne({id: req.params.id}); 
    if (!book_id) {
        res.status(404);
        res.send();
    }
    else {
        if (book_id.avail == req.body) {
            res.status(404);
            res.send();
        }
        else {
            let update_book = await Library.findOneAndUpdate({id: req.params.id}, req.body); 
            res.status(200);
            res.send();
        }
    }  
});

app.listen(7000);
console.log("http://localhost:7000/books");
