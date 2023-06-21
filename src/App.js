import React, { useState, useEffect } from 'react';
import './App.css';

const URL = "http://localhost:7000/books/"

function GetBooks() {
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
      fetch(URL)
          .then(response => response.json())
          .then(data => 
            {setBookData(data)});

  }, []);
  return (
      <div>
        <table>
        <thead>
          <tr>
            <th>ID Number</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Available</th>
            <th>Checked out by</th>
            <th>Due date</th>
          </tr>
        </thead>
        <tbody>
        {bookData && bookData.map(book => (
            <tr key={book._id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.avail.toString()}</td>
              <td>{book.who}</td>
              <td>{book.due}</td>
              </tr>))}
        </tbody>
        </table>
      </div>
  );
}

function CheckBook() {
  const [bookNumber, setBookNumber] = useState('');
  const [bookStatus, setBookStatus] = useState(true);

  const handleNumberChange = e => setBookNumber(e.target.value);
  const handleStatusChange = e => setBookStatus(e.target.value === 'True');

  const handleSubmit = e => {
    e.preventDefault();
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avail: bookStatus })
    };
    fetch(URL + bookNumber, requestOptions)
      .then(response => response.json())
      .then(data => setBookStatus(data.avail))
      .then(window.location.reload());
  }

  useEffect(() => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avail: bookStatus })
    };
    fetch(URL + bookNumber, requestOptions)
      .then(response => response.json())
      .then(data => setBookStatus(data.avail));
  }, [bookNumber, bookStatus]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a Book ID Number:
          <input type="text" id="bookNumber" name="bookNumber" value={bookNumber} onChange={handleNumberChange} />
        </label>
        <br />
        <label>
          <input type="radio" name="bookStatus" value="True" checked={bookStatus} onChange={handleStatusChange} />
          Check in
        </label>
        <br />
        <label>
          <input type="radio" name="bookStatus" value="False" checked={!bookStatus} onChange={handleStatusChange} />
          Check out
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <body>
        <br/>
        <GetBooks/>
        <br/>
        <CheckBook/>
      </body>
    </div>
  );
}

export default App;
