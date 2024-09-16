import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/non-blocking', (req, res) => {
    res.send('Non blocking request');
});

app.get('/blocking', (req, res) =>{
    let sum = 0;
    for(let i = 0; i < 10000000000; i++){
        sum += i;
    }
    console.log(sum)
    res.send(`result is ${sum}`);
})

app.listen(3000, () => {
    console.log('Server is running on localhost');
});