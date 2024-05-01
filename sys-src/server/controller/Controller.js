const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const Movie = require('../models/movieModel');
const testMovies = require('../controller/testMovies');

class Controller {
    static createAdminUser = async () => {
        try {
            // Check if Admin account exist
            const existingAccount = await User.findOne({
                $or: [
                    { username: process.env.ADMIN_USERNAME },
                    { email: process.env.ADMIN_EMAIL },
                ],
                admin: true,
            });
            if (existingAccount) {
                return false;
            }

            // Hash Password
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(
                process.env.ADMIN_PASSWORD,
                salt
            );

            const newUser = new User({
                username: process.env.ADMIN_USERNAME,
                email: process.env.ADMIN_EMAIL,
                password: passwordHash,
                admin: true,
            });
            await newUser.save();
            return true;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    static addTestMovies = async () => {
        try {
            // check if movies exist
            const existingMovie = await Movie.findOne({
                title: testMovies[0].title,
            });
            if (existingMovie) return false;
            for (let movie of testMovies) {
                const newMovie = new Movie({ ...movie });
                await newMovie.save();
            }
            return true;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    static initScripts = async () => {
        try {
            await this.createAdminUser();
            if (process.env.NODE_ENV !== 'production') {
                await this.addTestMovies();
            }
        } catch (e) {
            throw e;
        }
    };
}

module.exports = Controller;
