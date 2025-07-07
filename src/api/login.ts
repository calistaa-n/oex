export default function handler(req, res) {
  const { username, password } = JSON.parse(req.body);

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
}
