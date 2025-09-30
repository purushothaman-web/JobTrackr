import passport from 'passport';

// Initiates Google OAuth login
export const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Handles Google OAuth callback
import jwt from 'jsonwebtoken';

export const googleCallback = [
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    // Generate JWT for the user
    const token = jwt.sign({ id: req.user.id, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Redirect to frontend with token and user info
    const redirectUrl = `http://localhost:5173/google-callback?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`;
    res.redirect(redirectUrl);
  },
];
