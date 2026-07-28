import Datastore from '@seald-io/nedb';
import serverConfig from '../config/server.json' with { type: "json" };

export const books = new Datastore({ filename: `${serverConfig['db-path']}/books.db`, autoload: true });
export const authors = new Datastore({ filename: `${serverConfig['db-path']}/authors.db`, autoload: true });
export const users = new Datastore({ filename: `${serverConfig['db-path']}/users.db`, autoload: true });

export function connect() {
  console.log('Connecting databases...');
  books.ensureIndex({ fieldName: 'isbn', unique: true });
  authors.ensureIndex({ fieldName: 'name', unique: true });
  users.ensureIndex({ fieldName: 'email', unique: true });
  
}

export function createBook(bookData) {
  const { title, authorName, isbn, pubDate } = bookData;
  if (!isbn) throw new Error('Invalid ISBN');

  authors.findOne({ name: authorName }, (err, author) => {
    if (err) throw err;
    if (!author) {
      throw new Error(`Author "${authorName}" not found`);
    }

    books.insert(
      { title, authorName, isbn, pubDate: new Date(pubDate) },
      (err, newDoc) => {
        if (err) throw err;
        console.log('New book added:', newDoc);
      }
    );
  });
}


