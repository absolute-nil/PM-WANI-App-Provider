import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from "cors";
import express from 'express';
import 'express-async-errors'; // to use throw in async functions
import session from 'express-session';
import helmet from 'helmet';
import Keycloak from "keycloak-connect";
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler';

const app = express();
app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression())

const memoryStore = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

const keycloak = new Keycloak({
  store: memoryStore
});

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

//! the following imports should be after init of keycloak middleware otherwise app will not work
import { currentUser } from './middleware/current-user';
import { centralRegistryRouter } from './router/central-registry';
import { appRoutesPrefix, centralRegistryRoutePrefix, tokenRoutePrefix, userRoutePrefix } from './router/routes';
import { tokenRouter } from './router/token';
import { userRouter } from './router/users';

app.use(currentUser)

// Add APIs
app.use(appRoutesPrefix + centralRegistryRoutePrefix, centralRegistryRouter)
app.use(appRoutesPrefix + userRoutePrefix, userRouter)
app.use(appRoutesPrefix + tokenRoutePrefix, tokenRouter)



app.use(errorHandler);
export { app, keycloak };

