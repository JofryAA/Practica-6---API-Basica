const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// POST - Crear nuevo producto
app.post('/productos', (req, res) => {
    // saco los datos que vienen en el cuerpo de la peticion
    const { nombre, descripcion, precio } = req.body

    // si falta alguno de los tres campos respondo con 400
    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    // el id nuevo es el id mas alto + 1, asi nunca se repite
    // aunque se haya borrado algun producto
    let nuevoId = 1
    if (productos.length > 0) {
        nuevoId = Math.max(...productos.map(p => p.id)) + 1
    }

    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        descripcion: descripcion,
        precio: parseFloat(precio) // por si el precio llega como texto
    }

    productos.push(nuevoProducto)

    // 201 significa que se creo algo nuevo
    res.status(201).json(nuevoProducto)
})


// PUT - Actualizar producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // busco en que posicion del arreglo esta el producto
    // findIndex devuelve -1 si no lo encuentra
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { nombre, descripcion, precio } = req.body

    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    // reemplazo los datos pero dejo el mismo id
    productos[indice] = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        precio: parseFloat(precio)
    }

    res.status(200).json(productos[indice])
})


// DELETE - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // splice quita 1 elemento desde esa posicion y lo devuelve en un arreglo
    const productoEliminado = productos.splice(indice, 1)[0]

    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
