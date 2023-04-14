import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect('mongodb://localhost/serversoftwares', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao banco de dados');
}).catch(err => {
    console.log('Erro ao conectar ao banco de dados', err);
});

const ProdutoSchema = mongoose.Schema({
    codigo: Number,
    descricao: String,
    preco: Number,
    data_cadastro: {
      type: String,
      default: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${day}/${month}/${year}`;
      },
    },
  });
  

const Produto = mongoose.model('Produto', ProdutoSchema);


app.get('/produtos', async (req, res) => {
    const produtos = await Produto.find();
    res.json(produtos);
});

app.get('/produtos/:id', async (req, res) => {
    const produto = await Produto.findById(req.params.id);
    res.json(produto);
});

app.post('/produtos', async (req, res) => {
    const produto = new Produto(req.body);
    await produto.save();
    res.json(produto);
});

app.put('/produtos/:id', async (req, res) => {
    await Produto.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Produto atualizado com sucesso' });
});

app.delete('/produtos/:id', async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto excluído com sucesso' });
});


app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
});

