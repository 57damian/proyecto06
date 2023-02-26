const express = require('express')
const {Server} = require('socket.io')
const path = require('path')
const handlebars = require('express-handlebars')

const server = express()

server.use(express.json())
server.use(express.urlencoded({extends: true}))

const serverHttp = server.listen(8080, () => console.log('Server Up!!'))
const io = new Server(httpServer)





const ContenedorP = require(`/src/producto.js`);
let contenedorProductos = new ContenedorP(`./productos.txt`);

io.on(`connection`, socket => {


    socket.on(`sendProduct`, () => {
        ; (async () => {
            try {
                allProducts = await contenedorProductos.getAll();

                //Servidor --> Cliente : Se envian todos los mensajes al usuario que se conectó.
                socket.emit(`allProducts`, allProducts);
            } catch (err) {
                return res.status(404).json({
                    error: `Error ${err}`
                });
            }
        })();
    });

    socket.on(`addProducts`, data => {
        ; (async () => {

            const newProducto = {
                title: `${data.name}`,
                price: Number(data.price),
                thumbnail: `${data.img}`
            };
            const id = await contenedorProductos.save(newProducto);

            const product = await contenedorProductos.getById(id);

            //Envio el producto nuevo a todos los clientes conectados
            io.sockets.emit(`refreshTable`, product);
        })();

    });
});