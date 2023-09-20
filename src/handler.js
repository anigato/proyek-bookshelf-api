const { nanoid } = require('nanoid');
const books = require('./books');

// fungsi tambah buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // cek jika nama buku kosong & read page lebih besar dari pagecount
  if (newBook.name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // masukan ke array books
  books.push(newBook);
  // cek apakah buku sudah ada pada array books
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// fungsi lihat semua buku, hanya tampilkkan id, name dan publisher
const getAllBoooksHandler = (request) => {
  const { name, reading, finished } = request.query;

  // Konversi reading dan finished ke tipe data boolean (jika perlu)
  const isReading = reading === '1';
  const isNotReading = reading === '0';
  const isFinished = finished === '1';
  const isNotFinished = finished === '0';
  const hasNamed = name !== undefined;
  // let mystatus = 'success';
  let books2 = books;

  if (isReading) {
    // mystatus = 'reading';
    books2 = books.filter((book) => book.reading === true);
  } else if (isNotReading) {
    // mystatus = 'unreading';
    books2 = books.filter((book) => book.reading === false);
  } else if (isFinished) {
    // mystatus = 'finished';
    books2 = books.filter((book) => book.finished === true);
  } else if (isNotFinished) {
    // mystatus = 'unfinished';
    books2 = books.filter((book) => book.finished === false);
  } else if (hasNamed) {
    // mystatus = 'hasname';
    books2 = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  return {
    status: 'success',
    data: {
      books: books2.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
        // reading: book.reading,
        // finished: book.finished
      })),
    },
  };
};

// fungsi lihat buku berdasarkan id
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// ubah buku
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  // cek jika nama buku kosong & read page lebih besar dari pagecount
  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// hapus buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBoooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
