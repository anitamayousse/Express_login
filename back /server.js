const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
// Models
const User = require("../back /models/userModel");

const secret = "5aJif0OZjepB63NRwyNSkk0czzttHKjXNQbEImrW";

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Connexion à MongoDB
mongoose
	.connect(
		"mongodb+srv://Anita:gtXSsxboyg5LMeQQ@cluster0.oppld.mongodb.net/login?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
		}
	)
	.then(() => {
		console.log("Connected to MongoDB");
	});

// Routes
app.post("/register", async (req, res) => {
	// if (req.body.password.length < 6) {
	// 	return res.status(400).json({
	// 		message: "Invalid data",
	// 	});
	// }

	// 1 - Hasher le mot de passe
	const hashedPassword = await bcrypt.hash(req.body.password, 12);

	// 2 - Créer un utilisateur
	try {
		await User.create({
			email: req.body.email,
			password: hashedPassword,
		});
	} catch (err) {
		return res.status(400).json({
			message: "This account already exists",
		});
	}

	res.status(201).json({
		message: `User ${req.body.email} created`,
	});
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	// 1 - Vérifier si le compte associé à l'email existe
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}

	// 2 - Comparer le mot de passe au hash qui est dans la DB
	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}

	// 3 - Générer un token
	const token = jwt.sign({ id: user._id }, secret);

	// 4 - On met le token dans un cookie
	res.cookie("jwt", token, { httpOnly: true, secure: false });

	// 5 - Envoyer le cookie au client
	res.json({
		message: "Here is your cookie",
	});
});

app.get("/users", (req, res) => {
	// 1 - Vérifier le token qui est dans le cookie
	let data;
	try {
		data = jwt.verify(req.cookies.jwt, secret);
	} catch (err) {
		return res.status(401).json({
			message: "Your token is not valid",
		});
	}

	// L'utilisateur est authentifié/autorisé
	res.json({
		message: "Votre requête a été acceptée",
		data,
	});
});

// Start server
app.listen(8000, () => {
	console.log("Listening");
});