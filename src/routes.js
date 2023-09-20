const {
  addBookHandler,
  getAllBoooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  // tambah buku
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  // lihat semua buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBoooksHandler,
  },
  // lihat buku berdasarkan id
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler,
  },
  // ubah buku
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler,
  },
  // hapus buku
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
