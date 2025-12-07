export function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요한 기능입니다." });
    }
  
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "유효하지 않은 인증입니다." });
    }
  }
  