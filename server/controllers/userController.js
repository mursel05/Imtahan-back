const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { createTokens, verifyRefreshToken } = require("./tokenController");
const crypto = require("crypto");
const { sendMail } = require("../utils/mailSender");
const cookie = require("cookie");
const Token = require("../models/token");

exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res
        .status(400)
        .json({ success: false, message: "Hesab artıq mövcuddur" });
    } else {
      const newUser = new User({
        id: uuidv4(),
        name: req.body.name,
        surname: req.body.surname,
        photo: "",
        email: req.body.email,
        password: crypto
          .createHash("sha256")
          .update(req.body.password)
          .digest("hex"),
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: "free",
        lastSeen: new Date(),
        role: req.body.role,
      });
      await newUser.save();
      const tokens = await createTokens(newUser.id);
      if (tokens) {
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
        });
        res.cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
        });
        res.status(201).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: "Xəta baş verdi" });
      }
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (
        user.password ===
        crypto.createHash("sha256").update(req.body.password).digest("hex")
      ) {
        const tokens = await createTokens(user.id);
        if (tokens) {
          res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
            maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
          });
          res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
            maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
          });
          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ success: false, message: "Xəta baş verdi" });
        }
      } else {
        res.status(400).json({ success: false, message: "Şifrə yanlışdır" });
      }
    } else {
      res.status(404).json({ success: false, message: "Hesab tapılmadı" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.refreshTokens = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie);
    const refreshToken = cookies.refreshToken;
    const decoded = await verifyRefreshToken(refreshToken);
    if (decoded) {
      const tokens = await createTokens(decoded.sub);
      if (tokens) {
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
        });
        res.cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
        });
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: "Xəta baş verdi" });
      }
    } else {
      res.cookie("accessToken", "", { maxAge: 0 });
      res.cookie("refreshToken", "", { maxAge: 0 });
      res.status(400).json({ success: false, message: "Yanlış token" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const clientUrl = process.env.CLIENT_URL;
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenData = await Token.findOne({ userId: user.id });
      if (tokenData) {
        await Token.findOneAndUpdate(
          { userId: user.id },
          {
            token: resetToken,
            expiresAt: new Date(Date.now() + 3600 * 1000),
          }
        );
      } else {
        await Token.create({
          id: uuidv4(),
          token: resetToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 3600 * 1000),
          createdAt: new Date(),
        });
      }
      const data = {
        to: user.email,
        subject: "Şifrənizi yeniləyin",
        text: "Şifrənizi yeniləyin",
        html: `Bu məktub şifrənizi yeniləmək üçün göndərilmişdir. Şifrənizi yeniləmək üçün <a href="${clientUrl}/reset_password/${resetToken}">buraya</a> klikləyin. Keçid 1 saat ərzində etibarlıdır.<br/>Əgər bunu siz istəməmisinizsə, bu e-poçtu görməməzlikdən gələ bilərsiniz.`,
      };
      const result = await sendMail(data);
      if (result) {
        res.status(200).json({
          success: true,
          message:
            "Şifrənizi yeniləmək üçün e-poçt göndərilib. Zəhmət olmasa, e-poçtunuzu yoxlayın.",
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "E-poçt göndərilmədi" });
      }
    } else {
      res.status(404).json({ success: false, message: "Hesab tapılmadı" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const tokenData = await Token.findOneAndDelete({ token: req.body.token });
    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: "Yanlış token",
      });
    }
    const user = await User.findOne({ id: tokenData.userId });
    if (user) {
      user.password = crypto
        .createHash("sha256")
        .update(req.body.password)
        .digest("hex");
      await user.save();
      res.status(200).json({ success: true, message: "Şifrə yeniləndi" });
    } else {
      res.status(404).json({ success: false, message: "Hesab tapılmadı" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      {
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo,
        updatedAt: new Date(),
      }
    );
    if (user) {
      res.status(200).json({ success: true, message: "Məlumatlar yeniləndi" });
    } else {
      res.status(404).json({ success: false, message: "Hesab tapılmadı" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const emailRegex = new RegExp(req.params.email, "i");
    const users = await User.find({
      email: emailRegex,
      id: { $ne: req.userId },
    }).lean();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).lean();
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: "Hesab tapılmadı" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.userId }).lean();
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: "Hesab tapılmadı" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};
