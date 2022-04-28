const express = require('express')
const productos = require('./routes/productos.js')
const multer = require('multer')
const fs = require('fs')
const { extname } = require('path')
const {engine} = require('express-handlebars')

const app = express()

app.set('views', './views')
app.set('view engine', 'hbs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', productos)

app.engine(
    'hbs',
    engine({
        extname:'hbs',
        layoutsDir:__dirname+'/views/layouts',
        defaultLayout: 'index.hbs'
    })
)

let storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'uploads')
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    }
})

let upload = multer({storage})

const PORT = process.env.PORT || 8080


app.get('/', (req, res) => {
    res.render('main')
})

app.post("/", upload.none(), (req, res) => {
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let arr = JSON.parse(data)
            let ind = arr[arr.length - 1]['id'] + 1
            const {title, price, thumbnail} = req.body
            let productoNuevo = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            id: ind
            }
            arr.push(productoNuevo)
            fs.writeFile('./productos.json', JSON.stringify(arr), 'utf-8', (err) => {
                if(err){
                    return 'Error al escribir'
                } else {
                    res.render('uploaded', {data: productoNuevo})
                }
            } )
                }
    })
})

app.listen(PORT, () => {
    console.log(`Servidor http creado con express escuchando en el puerto ${PORT}`)
})

