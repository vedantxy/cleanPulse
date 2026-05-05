# Deployment Guide - CleanPulse (MERN Stack)

Follow these steps to deploy your application to the cloud.

## 1. Setup MongoDB Atlas (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new Cluster and a Database named `cleanpulse`.
3. Create a Database User with a username and password.
4. Add `0.0.0.0/0` to your IP Access List (for deployment).
5. Copy your **Connection String** (it should look like `mongodb+srv://<username>:<password>@cluster.mongodb.net/cleanpulse`).

## 2. Deploy Backend (Render)
1. Push your code to a GitHub repository.
2. Sign up for [Render](https://render.com/).
3. Create a new **Web Service**.
4. Connect your GitHub repository.
5. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: `supersecretkey123` (or any strong secret)
   - `PORT`: `10000` (Render's default)
7. Once deployed, copy your **Render Service URL** (e.g., `https://cleanpulse-backend.onrender.com`).


### Important Note on Vite Proxy
Your current frontend uses a central API configuration in `frontend/src/api/api.js`. For production, the application will automatically use the `VITE_API_URL` environment variable.
