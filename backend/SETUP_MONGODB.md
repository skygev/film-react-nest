# MongoDB setup for films storage

1. **Ensure MongoDB is running locally** on the default port `27017`.
2. **Create database and collection**
   - Open MongoDB Compass.
   - Click `+ Create Database`.
   - Set `Database Name` = `afisha`, `Collection Name` = `films`.
3. **Import initial data**
   - Go to the newly created `afisha` → `films` collection.
   - Click `ADD DATA` → `Import JSON or CSV file`.
   - Select `backend/test/mongodb_initial_stub.json` from the repository root.
   - Import all documents (or a subset if you want fewer films).
4. **Verify documents** – you should see films with an embedded `schedule` array.
5. **Run the backend**
   ```bash
   cd backend
   npm install
   DATABASE_URL=mongodb://127.0.0.1:27017/afisha npm run start:dev
   ```
   The server exposes endpoints under `http://localhost:3000/api/afisha`.

Now the application serves films and schedules backed by MongoDB.
