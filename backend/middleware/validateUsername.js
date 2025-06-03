export default function validateUsername(req, res, next) {
  const { username } = req.body;
  
  if (!username || username.length < 3) {
    return res.status(400).json({ 
      error: 'Username must be at least 3 characters long' 
    });
  }
  
  next();
}