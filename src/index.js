const express = require('express');
const path = require("path");
const encrypt = require("bcrypt");
const collection = require("./config");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.render("login");
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

// app.get('/home', (req, res) => {
//   res.render('home');
// })
// Registration
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password
  };

  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists");
  } else {
    //hashing
    const saltRounds = 10;
    const hashedPassword = await encrypt.hash(data.password, saltRounds);
    data.password = hashedPassword
    const userData = await collection.insertMany(data); // Use create for single doc
    console.log(userData);
  }
});

app.post("/login", async (req, res) => {
  try {
    const data = {
      name: req.body.username,
      password: req.body.password
    };

    const check = await collection.findOne({ name: data.name });
    if (!check) {
      res.send("No such username exists, please SignUp");
    }
    // Compare the password
    const passwordMatch = await encrypt.compare(data.password, check.password);
    if (passwordMatch) {
      res.render("home");
    } else {
      req.send("Wrong Passsword");
    }
  } catch {
    req.send("Wrong Details");
  }
})
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})