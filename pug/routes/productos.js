const express = require('express')
const fs = require('fs')

const {Router} = express

let router = new Router()

router.get('/productos', (req, res) => {   
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la consulta'})
        }else{
            res.render('productos', {data: JSON.parse(data)})
        }
    })
})

router.get('/productos/:id', (req, res) => {
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
    if (err) {
        res.send({message: 'Error en la consulta'})
    }else{
        let obj = JSON.parse(data)
        let ide = req.params.id
        let resp = obj.find(x => x.id == ide)
        if(resp) {
            res.render('uploaded', {data: resp})
        } else {
            res.send({ error : 'producto no encontrado' })
        }
        
    }
})
})

router.post('/productos', (req, res) => {
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
                    res.send({upload: 'ok', body: productoNuevo})
                }
            } )
                }
    })
})

router.put('/productos/:id', (req, res) => {
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let id = Number.parseInt(req.params.id)
            let prod = JSON.parse(data)
            let index = prod.findIndex(element => element['id'] === id)
            let newProd = { title: req.body.title,
                            price: req.body.price,
                            thumbnail: req.body.thumbnail,
                            id: id}
            if(index == (-1)){
                res.send({ error : 'producto no encontrado' })
            } else {
            prod.splice(index, 1, newProd)
            fs.writeFile('./productos.json', JSON.stringify(prod), 'utf-8', (err) => {
                if(err){
                    return 'Error al escribir'
                } else {
                    res.render('uploaded', {data: newProd})
                }
            } )
                }}
            
    })
})

router.delete('/productos/:id', (req, res) => {
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let id = Number.parseInt(req.params.id)
            let prod = JSON.parse(data)
            let index = prod.findIndex(element => element['id'] === id)
            prod.splice(index, 1)
            if(index == -1) {
                res.send({ error : 'producto no encontrado' })
            } else {
            fs.writeFile('./productos.json', JSON.stringify(prod), 'utf-8', (err) => {
                if(err){
                    return 'Error al escribir'
                } else {
                    res.send({delete: 'ok', id: id})
                }
            } )
                }}
            
    })
})

module.exports = router