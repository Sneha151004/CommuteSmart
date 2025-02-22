import jwt from 'jsonwebtoken'; // Importing jwt using ES module syntax

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);

// next() isliye hum krte hai taaki next middleware run ho
const fetchuser = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  // header ko auth-token naam se req jaega
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

export default fetchuser;  
