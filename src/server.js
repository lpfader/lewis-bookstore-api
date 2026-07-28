import express from "express";
import { body, validationResult } from "express-validator";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };

import { books, authors, users } from "./db_nedb.js";

const app = express();
app.use(express.json());


// ERRORS

function handleErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// -----------------------------
// Proof of concept
// -----------------------------

app.get("/", (req, res) => {
  res.send("Lewis Bookstore API is running 🚀");
});


// -----------------------------
// BOOKS
// -----------------------------
app.get("/books", (req, res) => {
  books.find({}, (err, docs) => res.json(docs));
});

app.get("/books/:id", (req, res) => {
  books.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.status(404).json({ error: "Book not found" });
    res.json(doc);
  });
});

app.post(
  "/books",
  [
    body("title").notEmpty(),
    body("authorName").notEmpty(),
    body("isbn").notEmpty(),
    body("pubDate").notEmpty(),
  ],
  handleErrors,
  (req, res) => {
    books.insert(req.body, (err, newDoc) => {
      res.status(201).json(newDoc);
    });
  }
);

app.put("/books/:id", (req, res) => {
  books.update({ _id: req.params.id }, { $set: req.body }, {}, (err, num) => {
    if (num === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book updated" });
  });
});

app.patch("/books/:id", (req, res) => {
  books.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, num) => {
      if (num === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json({ message: "Book partially updated" });
    }
  );
});


app.delete("/books/:id", (req, res) => {
  books.remove({ _id: req.params.id }, {}, (err, num) => {
    if (num === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  });
});


// AUTHORS

app.get("/authors", (req, res) => {
  authors.find({}, (err, docs) => res.json(docs));
});


app.get("/authors/:id", (req, res) => {
  authors.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.status(404).json({ error: "Author not found" });
    res.json(doc);
  });
});

app.put("/authors/:id", (req, res) => {
  authors.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, num) => {
      if (num === 0) return res.status(404).json({ error: "Author not found" });
      res.json({ message: "Author updated" });
    }
  );
});


app.post(
  "/authors",
  [body("name").notEmpty(), body("bio").notEmpty()],
  handleErrors,
  (req, res) => {
    authors.insert(req.body, (err, newDoc) => {
      res.status(201).json(newDoc);
    });
  }
);

app.patch("/authors/:id", (req, res) => {
  authors.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, num) => {
      if (num === 0) return res.status(404).json({ error: "Author not found" });
      res.json({ message: "Author partially updated" });
    }
  );
});

app.delete("/authors/:id", (req, res) => {
  authors.remove({ _id: req.params.id }, {}, (err, num) => {
    if (num === 0) return res.status(404).json({ error: "Author not found" });
    res.json({ message: "Author deleted" });
  });
});



// USERS

app.get("/users", (req, res) => {
  users.find({}, (err, docs) => res.json(docs));
});


app.get("/users/:id", (req, res) => {
  users.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.status(404).json({ error: "User not found" });
    res.json(doc);
  });
});


app.post(
  "/users",
  [body("name").notEmpty(), body("email").isEmail()],
  handleErrors,
  (req, res) => {
    users.insert(req.body, (err, newDoc) => {
      res.status(201).json(newDoc);
    });
  }
);

app.put("/users/:id", (req, res) => {
  users.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, num) => {
      if (num === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User updated" });
    }
  );
});

app.patch("/users/:id", (req, res) => {
  users.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, num) => {
      if (num === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User partially updated" });
    }
  );
});

app.delete("/users/:id", (req, res) => {
  users.remove({ _id: req.params.id }, {}, (err, num) => {
    if (num === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  });
});


// SWAGGER 

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ENGAGE SERVER


books.count({}, (err, count) => {
  if (count === 0) {
    books.insert({
      title: "Sample Book",
      authorName: "John Doe",
      isbn: "1234567890",
      pubDate: "2024-01-01"
    });
  }
});

authors.count({}, (err, count) => {
  if (count === 0) {
    authors.insert({
      name: "John Doe",
      bio: "Sample biography"
    });
  }
});

users.count({}, (err, count) => {
  if (count === 0) {
    users.insert({
      name: "Sample User",
      email: "sample@example.com",
      purchasedBooks: []
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lewis' Bookstore API is running on port ${PORT}`));