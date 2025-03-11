## Prerequisites
Node.js (v16 or higher)

## Getting Started

### Install dependancies

``` bash
npm install
```
### Set Up .env

```
DATABASE_URL="file:./dev.db"
```

### Set up the DB

```bash
npx prisma migrate dev
npx prisma db seed
```

### Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
