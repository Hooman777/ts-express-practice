import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as cookieParser from 'cookie-parser';
import {Sequelize} from 'sequelize-typescript';
import { User } from './models/user';
import * as bodyParser from 'body-parser';
import * as expressSession from 'express-session';
import * as connectSessionSequelize from 'connect-session-sequelize';
import * as path from 'path';

let sequelizeSessionStore = connectSessionSequelize(expressSession.Store);
let sequelize = new Sequelize({
    host: 'localhost',
    database: 'ts_express',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false,
    pool: {
        min: 0,
        max: 1,
        idle: 10000
    }
});

sequelize.addModels([User]);

const app = express();
const port = 3000;
app.locals.pretty = true;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    store: new sequelizeSessionStore({
        db: sequelize
    }),
    resave: false,  // we support the touch method so per the express-session docs this should be set to false
    proxy: true     // if you do SSL outside of node.
}));

// tslint:disable-next-line:no-suspicious-comment
// TODO: use the session to see if user is logged in, if not logged in then
// redirect the user to login page, else redirect to /
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    console.log(res);
    console.log(next);

    if (!req.session.user) {
        res.redirect("/")
    } else {
        next();
    }
});

// Home page, only authorized users should be able to log-in here
app.get('/', async (req: expressSession.Request, res: Response) => {
/*    const person = User.build({
        name: 'boo',
        username: 'bar',
        password: 'baz'
    } as User);

    await person.save();*/

    req.session.user = "googz";

    res.render('index');
});

// TODO: return login on /login
// TODO: handle login POST
// TODO: return register on /register
// TODO: handle register POST
// TOOD: clean session on /logout GET route

sequelize.sync({ force: true }).then();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
